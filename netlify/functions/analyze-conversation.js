/**
 * Netlify Function: Analyze Conversation
 * Uses Claude API to intelligently analyze conversation and extract structured report data
 */

const Anthropic = require('@anthropic-ai/sdk');

const ANALYSIS_PROMPT = `You are an expert data analyst for ZenCalcs. Analyze the following conversation between a user and an AI calculator assistant.

Extract and structure the following information in JSON format:

1. **reportTitle**: A professional title for the report (e.g., "Savings Growth Analysis", "Mortgage Comparison Report")

2. **calculationType**: Array of types (e.g., ["Financial"], ["Health", "Fitness"], etc.)

3. **executiveSummary**: Object with:
   - keyResult: The single most important outcome (e.g., "$45,230.45 total savings")
   - quickFacts: Array of 3-5 key data points (e.g., ["Initial Investment: $10,000", "Time Period: 5 years"])
   - bottomLine: One sentence summary of what this means for the user

4. **inputs**: Array of all input parameters with:
   - parameter: Name of the input (e.g., "Initial Investment", "Interest Rate")
   - value: The value
   - unit: Unit if applicable (e.g., "years", "%", "lbs", "")
   - description: Brief explanation of what this parameter represents (optional)

5. **methodology**: Object with:
   - formula: The calculation formula or method used (in plain English)
   - assumptions: Array of key assumptions made
   - limitations: Array of limitations or caveats

6. **results**: Object with:
   - primary: { value: "main result", description: "what it means" }
   - breakdown: Array of { label: "component name", value: "amount", percentage: "X%" } (optional)

7. **scenarios**: Array of scenarios if user asked "what if" questions:
   - name: Scenario name (e.g., "Higher Interest Rate", "Scenario 1")
   - inputs: Array of inputs for this scenario
   - result: The outcome
   - analysis: Brief comparison/analysis
   - userQuestion: Original question user asked

8. **visualizations**: Array of suggested charts:
   - type: "line", "bar", "pie", or "doughnut"
   - title: Chart title
   - data: { labels: [], values: [], format: "currency"/"percent"/"number" }

9. **insights**: Array of 3-5 analytical insights about the results (not just facts, but interpretations)

10. **recommendations**: Array of 3-5 actionable recommendations based on the results

Return ONLY valid JSON. Do not include any explanation or markdown formatting.

CONVERSATION:
{conversation}

JSON RESPONSE:`;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse request body
    const { conversationHistory } = JSON.parse(event.body);

    if (!conversationHistory || conversationHistory.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'No conversation history provided' })
      };
    }

    // Format conversation for analysis
    const conversationText = conversationHistory.map(msg => {
      return `${msg.role === 'user' ? 'USER' : 'ASSISTANT'}: ${msg.content}`;
    }).join('\n\n');

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    console.log('Analyzing conversation with Claude...');

    // Call Claude API for analysis
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: ANALYSIS_PROMPT.replace('{conversation}', conversationText)
      }]
    });

    // Extract JSON from response
    let analysisData;
    try {
      const responseText = message.content[0].text;
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
                        responseText.match(/```\n?([\s\S]*?)\n?```/);

      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      analysisData = JSON.parse(jsonText);

      console.log('Successfully parsed analysis data');
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Raw response:', message.content[0].text);

      // Return error but include raw response for debugging
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Failed to parse analysis response',
          rawResponse: message.content[0].text.substring(0, 500)
        })
      };
    }

    // Return analyzed data
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        analysis: analysisData,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error in analyze-conversation function:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
