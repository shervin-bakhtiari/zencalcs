/**
 * ZenCalcs Chart Builder
 * Creates professional charts for reports using Chart.js
 */

class ChartBuilder {
  // ZenCalcs Brand Colors (extracted from existing CSS)
  static COLORS = {
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

  /**
   * Create a line chart (for time series data)
   */
  static createLineChart(data) {
    return {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.label || 'Value',
          data: data.values,
          borderColor: ChartBuilder.COLORS.primary,
          backgroundColor: ChartBuilder.COLORS.primary + '20',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: ChartBuilder.COLORS.primary,
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              color: ChartBuilder.COLORS.textPrimary,
              padding: 15
            }
          },
          title: {
            display: true,
            text: data.title || 'Chart',
            font: { size: 16, weight: 'bold' },
            color: ChartBuilder.COLORS.primary,
            padding: { top: 10, bottom: 20 }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: ChartBuilder.COLORS.textSecondary,
              font: { size: 10 }
            }
          },
          y: {
            beginAtZero: data.beginAtZero !== false,
            grid: {
              color: ChartBuilder.COLORS.border,
              drawBorder: false
            },
            ticks: {
              color: ChartBuilder.COLORS.textSecondary,
              font: { size: 10 },
              callback: function(value) {
                if (data.format === 'currency') {
                  return '$' + value.toLocaleString();
                } else if (data.format === 'percent') {
                  return value.toLocaleString() + '%';
                }
                return value.toLocaleString();
              }
            }
          }
        }
      }
    };
  }

  /**
   * Create a bar chart (for comparisons)
   */
  static createBarChart(data) {
    const colors = data.values.map((_, i) => {
      const colorKeys = ['primary', 'secondary', 'success', 'warning', 'error'];
      return ChartBuilder.COLORS[colorKeys[i % colorKeys.length]];
    });

    return {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.label || 'Value',
          data: data.values,
          backgroundColor: colors,
          borderColor: colors.map(c => c),
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: data.title || 'Comparison',
            font: { size: 16, weight: 'bold' },
            color: ChartBuilder.COLORS.primary,
            padding: { top: 10, bottom: 20 }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: ChartBuilder.COLORS.textSecondary,
              font: { size: 10 }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: ChartBuilder.COLORS.border,
              drawBorder: false
            },
            ticks: {
              color: ChartBuilder.COLORS.textSecondary,
              font: { size: 10 },
              callback: function(value) {
                if (data.format === 'currency') {
                  return '$' + value.toLocaleString();
                } else if (data.format === 'percent') {
                  return value.toLocaleString() + '%';
                }
                return value.toLocaleString();
              }
            }
          }
        }
      }
    };
  }

  /**
   * Create a pie/doughnut chart (for allocation)
   */
  static createPieChart(data) {
    const backgroundColors = [
      ChartBuilder.COLORS.primary,
      ChartBuilder.COLORS.secondary,
      ChartBuilder.COLORS.success,
      ChartBuilder.COLORS.warning,
      ChartBuilder.COLORS.error
    ];

    return {
      type: data.type || 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: backgroundColors.slice(0, data.values.length),
          borderColor: '#FFFFFF',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { size: 11 },
              color: ChartBuilder.COLORS.textPrimary,
              padding: 12,
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: data.title || 'Distribution',
            font: { size: 16, weight: 'bold' },
            color: ChartBuilder.COLORS.primary,
            padding: { top: 10, bottom: 20 }
          }
        }
      }
    };
  }

  /**
   * Create a multi-line chart (for scenario comparisons)
   */
  static createMultiLineChart(scenarios) {
    const colors = [
      ChartBuilder.COLORS.success,
      ChartBuilder.COLORS.primary,
      ChartBuilder.COLORS.warning,
      ChartBuilder.COLORS.error,
      ChartBuilder.COLORS.secondary
    ];

    const datasets = scenarios.map((scenario, index) => ({
      label: scenario.name,
      data: scenario.values,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      tension: 0.4,
      fill: false,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: colors[index % colors.length],
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      borderDash: index > 0 ? [5, 5] : []
    }));

    return {
      type: 'line',
      data: {
        labels: scenarios[0].labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              color: ChartBuilder.COLORS.textPrimary,
              padding: 15,
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Scenario Comparison',
            font: { size: 16, weight: 'bold' },
            color: ChartBuilder.COLORS.primary,
            padding: { top: 10, bottom: 20 }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: ChartBuilder.COLORS.textSecondary,
              font: { size: 10 }
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: ChartBuilder.COLORS.border,
              drawBorder: false
            },
            ticks: {
              color: ChartBuilder.COLORS.textSecondary,
              font: { size: 10 },
              callback: value => '$' + value.toLocaleString()
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        }
      }
    };
  }
}

// Export for use in other files
window.ChartBuilder = ChartBuilder;
