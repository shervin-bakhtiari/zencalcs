/**
 * ZenCalcs Professional Report Generator
 * Generates comprehensive PDF reports with charts, analysis, and insights
 */

class ReportGenerator {
  constructor() {
    this.colors = {
      primary: '#2C5F6F',
      secondary: '#1E40AF',
      success: '#6B9080',
      warning: '#F59E0B',
      error: '#EF4444',
      textPrimary: '#2D3748',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      backgroundLight: '#F8F9FA'
    };
  }

  /**
   * Generate a professional PDF report from conversation data
   */
  async generateReport(conversationHistory, analysisData = null) {
    try {
      // If no analysis data provided, use client-side analyzer
      if (!analysisData) {
        console.log('Using client-side conversation analyzer...');
        analysisData = ConversationAnalyzer.analyzeSimple(conversationHistory);
      }

      // Check if jsPDF is available
      console.log('Checking jsPDF availability...');
      console.log('window.jspdf:', window.jspdf);
      console.log('window.jsPDF:', window.jsPDF);

      // Initialize jsPDF - try different ways the CDN might expose it
      let jsPDF;
      if (window.jspdf && window.jspdf.jsPDF) {
        jsPDF = window.jspdf.jsPDF;
      } else if (window.jsPDF) {
        jsPDF = window.jsPDF;
      } else {
        throw new Error('jsPDF library not loaded. Please refresh the page and try again.');
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let yPos = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Helper function to check if we need a new page
      const checkPageBreak = (requiredSpace) => {
        if (yPos + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
          return true;
        }
        return false;
      };

      // Helper function to add section heading
      const addSectionHeading = (text, level = 1) => {
        checkPageBreak(15);
        if (level === 1) {
          doc.setFontSize(16);
          const rgb = this.hexToRgb(this.colors.primary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFontSize(12);
          const rgb = this.hexToRgb(this.colors.secondary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.setFont(undefined, 'bold');
        }
        doc.text(text, margin, yPos);
        yPos += level === 1 ? 8 : 6;

        // Add underline for main headings
        if (level === 1) {
          const rgb = this.hexToRgb(this.colors.border);
          doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
          doc.setLineWidth(0.5);
          doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
          yPos += 4;
        }
      };

      // Helper function to add body text
      const addBodyText = (text, indent = 0) => {
        doc.setFontSize(10);
        const rgb = this.hexToRgb(this.colors.textPrimary);
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFont(undefined, 'normal');

        const lines = doc.splitTextToSize(text, contentWidth - indent);
        lines.forEach(line => {
          checkPageBreak(6);
          doc.text(line, margin + indent, yPos);
          yPos += 5;
        });
      };

      // 1. REPORT HEADER
      const primaryRgb = this.hexToRgb(this.colors.primary);
      doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('ZenCalcs', margin, 15);

      doc.setFontSize(18);
      doc.text(analysisData.reportTitle || 'Calculation Report', margin, 28);

      // Date
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Generated: ${dateStr}`, pageWidth - margin, 15, { align: 'right' });

      yPos = 50;

      // 2. EXECUTIVE SUMMARY
      if (analysisData.executiveSummary) {
        addSectionHeading('Executive Summary', 1);

        // Key Result Box
        const bgRgb = this.hexToRgb(this.colors.backgroundLight);
        doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
        doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');

        doc.setFontSize(11);
        const textSecRgb = this.hexToRgb(this.colors.textSecondary);
        doc.setTextColor(textSecRgb[0], textSecRgb[1], textSecRgb[2]);
        doc.text('Key Result:', margin + 5, yPos + 7);

        doc.setFontSize(16);
        const primRgb = this.hexToRgb(this.colors.primary);
        doc.setTextColor(primRgb[0], primRgb[1], primRgb[2]);
        doc.setFont(undefined, 'bold');
        doc.text(analysisData.executiveSummary.keyResult || 'See details below', margin + 5, yPos + 15);

        yPos += 30;

        // Quick Facts
        if (analysisData.executiveSummary.quickFacts && analysisData.executiveSummary.quickFacts.length > 0) {
          doc.setFontSize(11);
          let rgb = this.hexToRgb(this.colors.textSecondary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.setFont(undefined, 'bold');
          doc.text('Quick Facts:', margin, yPos);
          yPos += 6;

          doc.setFont(undefined, 'normal');
          rgb = this.hexToRgb(this.colors.textPrimary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          analysisData.executiveSummary.quickFacts.forEach(fact => {
            checkPageBreak(6);
            doc.text('• ' + fact, margin + 5, yPos);
            yPos += 5;
          });
          yPos += 3;
        }

        // Bottom Line
        if (analysisData.executiveSummary.bottomLine) {
          doc.setFontSize(10);
          const rgb = this.hexToRgb(this.colors.textPrimary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.setFont(undefined, 'italic');
          const bottomLineLines = doc.splitTextToSize(analysisData.executiveSummary.bottomLine, contentWidth);
          bottomLineLines.forEach(line => {
            checkPageBreak(6);
            doc.text(line, margin, yPos);
            yPos += 5;
          });
        }

        yPos += 8;
      }

      // 3. INPUT PARAMETERS
      if (analysisData.inputs && analysisData.inputs.length > 0) {
        checkPageBreak(30);
        addSectionHeading('Input Parameters', 1);

        // Create table
        const tableData = analysisData.inputs.map(input => [
          input.parameter,
          input.value + (input.unit ? ' ' + input.unit : ''),
          input.description || ''
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Parameter', 'Value', 'Description']],
          body: tableData,
          theme: 'striped',
          headStyles: {
            fillColor: this.hexToRgb(this.colors.primary),
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9,
            textColor: this.hexToRgb(this.colors.textPrimary)
          },
          alternateRowStyles: {
            fillColor: this.hexToRgb(this.colors.backgroundLight)
          },
          margin: { left: margin, right: margin }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // 4. CALCULATION METHODOLOGY
      if (analysisData.methodology) {
        checkPageBreak(40);
        addSectionHeading('Calculation Methodology', 1);

        if (analysisData.methodology.formula) {
          addSectionHeading('Formula Used:', 2);
          addBodyText(analysisData.methodology.formula);
          yPos += 3;
        }

        if (analysisData.methodology.assumptions && analysisData.methodology.assumptions.length > 0) {
          addSectionHeading('Key Assumptions:', 2);
          analysisData.methodology.assumptions.forEach(assumption => {
            checkPageBreak(6);
            doc.setFontSize(10);
            const rgb = this.hexToRgb(this.colors.textPrimary);
            doc.setTextColor(rgb[0], rgb[1], rgb[2]);
            doc.text('• ' + assumption, margin + 3, yPos);
            yPos += 5;
          });
          yPos += 3;
        }

        if (analysisData.methodology.limitations && analysisData.methodology.limitations.length > 0) {
          addSectionHeading('Limitations:', 2);
          analysisData.methodology.limitations.forEach(limitation => {
            checkPageBreak(6);
            doc.setFontSize(10);
            const rgb = this.hexToRgb(this.colors.textSecondary);
            doc.setTextColor(rgb[0], rgb[1], rgb[2]);
            doc.text('• ' + limitation, margin + 3, yPos);
            yPos += 5;
          });
          yPos += 5;
        }
      }

      // 5. RESULTS
      if (analysisData.results) {
        checkPageBreak(30);
        addSectionHeading('Results', 1);

        if (analysisData.results.primary) {
          // Light success color with transparency (approximate with lighter RGB)
          const successRgb = this.hexToRgb(this.colors.success);
          doc.setFillColor(successRgb[0] + 40, successRgb[1] + 40, successRgb[2] + 40);
          doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');

          doc.setFontSize(11);
          let rgb = this.hexToRgb(this.colors.textSecondary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.text(analysisData.results.primary.description || 'Primary Result:', margin + 5, yPos + 7);

          doc.setFontSize(14);
          rgb = this.hexToRgb(this.colors.success);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.setFont(undefined, 'bold');
          doc.text(analysisData.results.primary.value, margin + 5, yPos + 15);

          yPos += 25;
        }

        // Breakdown table
        if (analysisData.results.breakdown && analysisData.results.breakdown.length > 0) {
          const breakdownData = analysisData.results.breakdown.map(item => [
            item.label,
            item.value,
            item.percentage || ''
          ]);

          doc.autoTable({
            startY: yPos,
            head: [['Component', 'Value', 'Percentage']],
            body: breakdownData,
            theme: 'grid',
            headStyles: {
              fillColor: this.hexToRgb(this.colors.secondary),
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 10
            },
            bodyStyles: {
              fontSize: 9,
              textColor: this.hexToRgb(this.colors.textPrimary)
            },
            margin: { left: margin, right: margin }
          });

          yPos = doc.lastAutoTable.finalY + 10;
        }
      }

      // 6. CHARTS AND VISUALIZATIONS
      if (analysisData.visualizations && analysisData.visualizations.length > 0) {
        for (const viz of analysisData.visualizations) {
          checkPageBreak(80);
          addSectionHeading(viz.title || 'Visualization', 1);

          try {
            // Create chart
            const chartImage = await this.generateChartImage(viz);

            if (chartImage) {
              const imgWidth = contentWidth * 0.9;
              const imgHeight = 70;
              const xOffset = margin + (contentWidth - imgWidth) / 2;

              doc.addImage(chartImage, 'PNG', xOffset, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 10;
            }
          } catch (error) {
            console.error('Error generating chart:', error);
            addBodyText('Chart visualization could not be generated.');
            yPos += 5;
          }
        }
      }

      // 7. SCENARIO COMPARISON
      if (analysisData.scenarios && analysisData.scenarios.length > 1) {
        checkPageBreak(40);
        addSectionHeading('Scenario Comparison', 1);

        const scenarioData = analysisData.scenarios.map(scenario => [
          scenario.name,
          scenario.result,
          scenario.userQuestion ? scenario.userQuestion.substring(0, 50) + '...' : ''
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Scenario', 'Result', 'Description']],
          body: scenarioData,
          theme: 'striped',
          headStyles: {
            fillColor: this.hexToRgb(this.colors.primary),
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9,
            textColor: this.hexToRgb(this.colors.textPrimary)
          },
          alternateRowStyles: {
            fillColor: this.hexToRgb(this.colors.backgroundLight)
          },
          margin: { left: margin, right: margin }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // 8. KEY INSIGHTS
      if (analysisData.insights && analysisData.insights.length > 0) {
        checkPageBreak(30);
        addSectionHeading('Key Insights', 1);

        analysisData.insights.forEach((insight, index) => {
          checkPageBreak(10);

          // Insight box
          const bgRgb = this.hexToRgb(this.colors.backgroundLight);
          doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
          doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');

          doc.setFontSize(10);
          let rgb = this.hexToRgb(this.colors.primary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}.`, margin + 3, yPos + 7);

          rgb = this.hexToRgb(this.colors.textPrimary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.setFont(undefined, 'normal');
          const insightLines = doc.splitTextToSize(insight, contentWidth - 15);
          doc.text(insightLines[0], margin + 8, yPos + 7);

          yPos += 14;
        });

        yPos += 5;
      }

      // 9. RECOMMENDATIONS
      if (analysisData.recommendations && analysisData.recommendations.length > 0) {
        checkPageBreak(30);
        addSectionHeading('Recommendations', 1);

        analysisData.recommendations.forEach((rec, index) => {
          checkPageBreak(8);
          doc.setFontSize(10);
          let rgb = this.hexToRgb(this.colors.success);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          doc.text('✓', margin, yPos);

          rgb = this.hexToRgb(this.colors.textPrimary);
          doc.setTextColor(rgb[0], rgb[1], rgb[2]);
          const recLines = doc.splitTextToSize(rec, contentWidth - 10);
          doc.text(recLines, margin + 5, yPos);
          yPos += 6;
        });

        yPos += 5;
      }

      // 10. FOOTER
      const pageCount = doc.internal.getNumberOfPages();
      const footerRgb = this.hexToRgb(this.colors.textSecondary);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(footerRgb[0], footerRgb[1], footerRgb[2]);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        doc.text(
          'Generated by ZenCalcs AI Assistant',
          margin,
          pageHeight - 10
        );
        doc.text(
          dateStr,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      // Generate filename
      const calcType = (analysisData.calculationType || ['Calculation'])[0];
      const filename = `ZenCalcs_${calcType}_Report_${today.toISOString().split('T')[0]}.pdf`;

      // Save the PDF
      doc.save(filename);

      return {
        success: true,
        filename: filename
      };

    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw error;
    }
  }

  /**
   * Generate chart image for embedding in PDF
   */
  async generateChartImage(vizConfig) {
    return new Promise((resolve, reject) => {
      try {
        // Create temporary canvas
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 400;
        canvas.style.display = 'none';
        document.body.appendChild(canvas);

        // Get chart configuration
        let chartConfig;
        if (vizConfig.type === 'line') {
          chartConfig = ChartBuilder.createLineChart(vizConfig.data);
        } else if (vizConfig.type === 'bar') {
          chartConfig = ChartBuilder.createBarChart(vizConfig.data);
        } else if (vizConfig.type === 'pie' || vizConfig.type === 'doughnut') {
          chartConfig = ChartBuilder.createPieChart(vizConfig.data);
        } else {
          throw new Error('Unsupported chart type: ' + vizConfig.type);
        }

        // Override title
        if (chartConfig.options && chartConfig.options.plugins) {
          chartConfig.options.plugins.title.text = vizConfig.title;
        }

        // Create chart
        const chart = new Chart(canvas, chartConfig);

        // Wait for chart to render, then get image
        setTimeout(() => {
          const imageData = canvas.toDataURL('image/png');
          chart.destroy();
          document.body.removeChild(canvas);
          resolve(imageData);
        }, 500);

      } catch (error) {
        console.error('Error creating chart image:', error);
        reject(error);
      }
    });
  }

  /**
   * Convert hex color to RGB array for jsPDF
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }
}

// Export for use in other files
window.ReportGenerator = ReportGenerator;
