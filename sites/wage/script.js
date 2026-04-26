// Initialize chart
const ctx = document.getElementById('incomeChart').getContext('2d');
let incomeChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        datasets: [{
            label: 'Income (CHF)',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(42, 91, 215, 0.7)',
                'rgba(42, 91, 215, 0.7)',
                'rgba(42, 91, 215, 0.7)',
                'rgba(42, 91, 215, 0.7)'
            ],
            borderColor: [
                'rgba(42, 91, 215, 1)',
                'rgba(42, 91, 215, 1)',
                'rgba(42, 91, 215, 1)',
                'rgba(42, 91, 215, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return value + ' CHF';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.parsed.y.toLocaleString('de-CH') + ' CHF';
                    }
                }
            }
        }
    }
});

// Toggle between hourly and monthly input
document.getElementById('hourly-toggle').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('monthly-toggle').classList.remove('active');
    document.getElementById('hourly-input-group').classList.remove('hidden');
    document.getElementById('monthly-input-group').classList.add('hidden');
    calculateIncome();
});

document.getElementById('monthly-toggle').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('hourly-toggle').classList.remove('active');
    document.getElementById('monthly-input-group').classList.remove('hidden');
    document.getElementById('hourly-input-group').classList.add('hidden');
    calculateIncome();
});

// Auto-calculate when monthly salary changes
document.getElementById('monthly-salary').addEventListener('input', function() {
    if (document.getElementById('monthly-toggle').classList.contains('active')) {
        calculateIncome();
    }
});

// Auto-calculate when hourly wage changes
document.getElementById('hourly-wage').addEventListener('input', function() {
    if (document.getElementById('hourly-toggle').classList.contains('active')) {
        calculateIncome();
    }
});

function calculateIncome() {
    // Get common input values
    const hoursPerWeek = parseFloat(document.getElementById('hours-per-week').value);
    const daysPerWeek = parseFloat(document.getElementById('days-per-week').value);
    const vacationWeeks = parseFloat(document.getElementById('vacation-weeks').value);
    
    let hourlyWage, monthlySalary;
    
    // Determine which input is active
    if (document.getElementById('hourly-toggle').classList.contains('active')) {
        // Calculate from hourly wage
        hourlyWage = parseFloat(document.getElementById('hourly-wage').value);
        if (isNaN(hourlyWage)) {
            return;
        }
        monthlySalary = hourlyWage * hoursPerWeek * ((52 - vacationWeeks) / 12);
        document.getElementById('monthly-salary').value = monthlySalary.toFixed(2);
    } else {
        // Calculate from monthly salary
        monthlySalary = parseFloat(document.getElementById('monthly-salary').value);
        if (isNaN(monthlySalary)) {
            return;
        }
        hourlyWage = monthlySalary / (hoursPerWeek * ((52 - vacationWeeks) / 12));
        document.getElementById('hourly-wage').value = hourlyWage.toFixed(2);
    }
    
    // Validate input
    if (isNaN(hoursPerWeek) || isNaN(daysPerWeek) || isNaN(vacationWeeks)) {
        alert("Bitte geben Sie gültige Zahlen für alle Felder ein");
        return;
    }
    
    // Calculate incomes
    const dailyIncome = hourlyWage * (hoursPerWeek / daysPerWeek);
    const weeklyIncome = hourlyWage * hoursPerWeek;
    const yearlyIncome = weeklyIncome * (52 - vacationWeeks);
    
    // Update results display
    document.getElementById('daily-income').textContent = formatCHF(dailyIncome);
    document.getElementById('weekly-income').textContent = formatCHF(weeklyIncome);
    document.getElementById('monthly-income').textContent = formatCHF(monthlySalary);
    document.getElementById('yearly-income').textContent = formatCHF(yearlyIncome);
    
    // Update chart
    incomeChart.data.datasets[0].data = [dailyIncome, weeklyIncome, monthlySalary, yearlyIncome];
    incomeChart.update();
    
    // Update comparison bars
    updateComparisonBars(monthlySalary);
}

function formatCHF(amount) {
    return amount.toLocaleString('de-CH', {
        style: 'currency',
        currency: 'CHF',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateComparisonBars(monthlyIncome) {
    // Swiss salary benchmarks (approximate)
    const minWage = 3800;
    const medianSalary = 6500;
    const highSalary = 10000;
    
    // Calculate percentages for progress bars
    const minWagePercent = Math.min(100, (monthlyIncome / minWage) * 100);
    const medianPercent = Math.min(100, (monthlyIncome / medianSalary) * 100);
    const highPercent = Math.min(100, (monthlyIncome / highSalary) * 100);
    
    // Update progress bars
    document.getElementById('min-wage-progress').style.width = `${minWagePercent}%`;
    document.getElementById('median-progress').style.width = `${medianPercent}%`;
    document.getElementById('high-progress').style.width = `${highPercent}%`;
}

// Calculate on page load with default values
window.addEventListener('load', function() {
    calculateIncome();
});