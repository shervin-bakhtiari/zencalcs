/**
 * ZenCalcs Conversation Analyzer
 * Client-side fallback for analyzing conversations when Netlify Function is unavailable
 */

class ConversationAnalyzer {
  /**
   * Analyze conversation and extract structured data
   * This is a simplified client-side version - Netlify Function provides better analysis
   */
  static analyzeSimple(conversation) {
    console.log('Using client-side conversation analysis (fallback mode)');

    const inputs = [];
    const results = [];
    let calculationType = [];
    const scenarios = [];
    let currentScenario = null;

    // Parse conversation messages
    conversation.forEach((msg, index) => {
      if (msg.role === 'user') {
        // Detect calculation type from user messages
        const content = msg.content.toLowerCase();

        if (!calculationType.length || calculationType.includes('Financial')) {
          if (content.match(/save|saving|invest|loan|mortgage|interest|payment|dollar|money|\$|finance/i)) {
            if (!calculationType.includes('Financial')) calculationType.push('Financial');
          }
        }

        if (content.match(/bmi|weight|height|body|calorie|calories|nutrition|diet|health/i)) {
          if (!calculationType.includes('Health')) calculationType.push('Health');
        }

        if (content.match(/workout|exercise|fitness|run|pace|walk|cardio|training/i)) {
          if (!calculationType.includes('Fitness')) calculationType.push('Fitness');
        }

        // Detect scenarios (what-if questions)
        if (content.match(/what if|if i|suppose|alternatively|instead|compare|scenario/i)) {
          currentScenario = {
            name: `Scenario ${scenarios.length + 1}`,
            inputs: [],
            userQuestion: msg.content
          };
        }

        // Extract numerical inputs with context
        const numberMatches = msg.content.matchAll(/(\w+[\s:]+)?(\$?[\d,]+\.?\d*)/g);
        for (const match of numberMatches) {
          const context = match[1] || '';
          let value = match[2];
          let unit = '';

          // Determine unit
          if (value.includes('$')) {
            unit = '';
            value = value.replace('$', '$');
          } else if (msg.content.toLowerCase().includes('month')) {
            unit = 'months';
          } else if (msg.content.toLowerCase().includes('year')) {
            unit = 'years';
          } else if (msg.content.toLowerCase().includes('percent') || msg.content.includes('%')) {
            unit = '%';
          } else if (msg.content.toLowerCase().includes('pound') || msg.content.toLowerCase().includes('lb')) {
            unit = 'lbs';
          } else if (msg.content.toLowerCase().includes('dollar')) {
            unit = '';
            value = '$' + value;
          }

          const input = {
            parameter: context.trim() || 'Amount',
            value: value,
            unit: unit
          };

          inputs.push(input);

          if (currentScenario) {
            currentScenario.inputs.push(input);
          }
        }
      }

      if (msg.role === 'assistant') {
        // Extract calculated results (look for currency, percentages, large numbers)
        const currencyMatches = msg.content.matchAll(/\$[\d,]+\.?\d*/g);
        for (const match of currencyMatches) {
          results.push(match[0]);
        }

        const percentMatches = msg.content.matchAll(/(\d+\.?\d*)%/g);
        for (const match of percentMatches) {
          results.push(match[1] + '%');
        }

        // If we're building a scenario, capture the result
        if (currentScenario) {
          currentScenario.result = results[results.length - 1] || 'See analysis';
          currentScenario.analysis = msg.content.substring(0, 150) + '...';
          scenarios.push(currentScenario);
          currentScenario = null;
        }
      }
    });

    // Default to Financial if no type detected
    if (calculationType.length === 0) {
      calculationType = ['Financial'];
    }

    // Get final result
    const finalResult = results[results.length - 1] || 'Calculation completed';

    // Generate report title
    const reportTitle = `${calculationType.join(' & ')} Calculation Report`;

    // Create executive summary
    const executiveSummary = {
      keyResult: finalResult,
      quickFacts: inputs.slice(0, 4).map(i =>
        `${i.parameter}: ${i.value}${i.unit ? ' ' + i.unit : ''}`
      ),
      bottomLine: `Your ${calculationType[0].toLowerCase()} calculation is complete with a result of ${finalResult}.`
    };

    // Generate visualizations based on data
    const visualizations = [];

    // If we have multiple results, create a line chart
    if (results.length > 2) {
      const numericResults = results
        .map(r => parseFloat(r.replace(/[$,%]/g, '')))
        .filter(n => !isNaN(n));

      if (numericResults.length > 2) {
        visualizations.push({
          type: 'line',
          title: 'Progress Over Time',
          data: {
            labels: numericResults.map((_, i) => `Step ${i + 1}`),
            values: numericResults,
            format: results[0].includes('$') ? 'currency' : 'number'
          }
        });
      }
    }

    // If we have scenarios, create comparison chart
    if (scenarios.length > 1) {
      const scenarioResults = scenarios.map(s => {
        const numMatch = s.result.match(/[\d,]+\.?\d*/);
        return numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : 0;
      });

      visualizations.push({
        type: 'bar',
        title: 'Scenario Comparison',
        data: {
          labels: scenarios.map(s => s.name),
          values: scenarioResults,
          format: 'currency'
        }
      });
    }

    // Build structured data
    return {
      reportTitle: reportTitle,
      calculationType: calculationType,
      executiveSummary: executiveSummary,
      inputs: inputs.slice(0, 10), // Limit to first 10 inputs
      methodology: {
        formula: 'Custom calculation based on provided inputs',
        assumptions: [
          'Standard calculation methods applied',
          'Values rounded to nearest appropriate decimal',
          'Results are estimates for planning purposes'
        ],
        limitations: [
          'Results are estimates and may vary',
          'Consult professionals for specific advice',
          'Individual circumstances may affect actual outcomes'
        ]
      },
      results: {
        primary: {
          value: finalResult,
          description: 'Final calculated result'
        },
        breakdown: []
      },
      scenarios: scenarios,
      visualizations: visualizations,
      insights: [
        `Processed ${conversation.length / 2} calculation exchanges`,
        `Analyzed ${inputs.length} input parameters`,
        `Generated ${results.length} results`,
        scenarios.length > 0 ? `Compared ${scenarios.length} different scenarios` : null
      ].filter(Boolean),
      recommendations: [
        'Review the detailed breakdown for accuracy',
        'Consider consulting a professional for personalized advice',
        'Save this report for your records',
        scenarios.length > 1 ? 'Compare scenarios to make an informed decision' : null
      ].filter(Boolean)
    };
  }
}

// Export for use in other files
window.ConversationAnalyzer = ConversationAnalyzer;
