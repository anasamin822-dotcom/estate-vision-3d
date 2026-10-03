/**
 * EstateVision 3D - Mortgage & Investment Calculator Engine
 * Handles real-time mathematical calculations for EMI, loan principal, and amortization
 */

const MortgageCalculator = (function() {
  'use strict';

  // DOM Elements cache
  let homeValueInput, downPaymentInput, interestRateInput, loanTenureInput;
  let homeValueDisplay, downPaymentDisplay, interestRateDisplay, loanTenureDisplay;
  let monthlyEmiOutput, totalPrincipalOutput, totalInterestOutput, totalRepaymentOutput;
  let barPrincipalSegment, barInterestSegment;

  function init() {
    homeValueInput = document.getElementById('homeValueInput');
    downPaymentInput = document.getElementById('downPaymentInput');
    interestRateInput = document.getElementById('interestRateInput');
    loanTenureInput = document.getElementById('loanTenureInput');

    homeValueDisplay = document.getElementById('homeValueDisplay');
    downPaymentDisplay = document.getElementById('downPaymentDisplay');
    interestRateDisplay = document.getElementById('interestRateDisplay');
    loanTenureDisplay = document.getElementById('loanTenureDisplay');

    monthlyEmiOutput = document.getElementById('monthlyEmiOutput');
    totalPrincipalOutput = document.getElementById('totalPrincipalOutput');
    totalInterestOutput = document.getElementById('totalInterestOutput');
    totalRepaymentOutput = document.getElementById('totalRepaymentOutput');

    barPrincipalSegment = document.getElementById('barPrincipalSegment');
    barInterestSegment = document.getElementById('barInterestSegment');

    if (!homeValueInput) return;

    bindEvents();
    calculate();
  }

  function bindEvents() {
    [homeValueInput, downPaymentInput, interestRateInput, loanTenureInput].forEach(slider => {
      slider.addEventListener('input', () => {
        updateSliderFill(slider);
        calculate();
      });
      // Initial fill on load
      updateSliderFill(slider);
    });

    const applyBtn = document.getElementById('calcApplyBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (window.App && window.App.showToast) {
          window.App.showToast('Calculator Profile Saved', 'Your financial configuration has been preloaded for consultation.');
        }
      });
    }
  }

  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--accent-gold) 0%, var(--accent-gold) ${pct}%, var(--border-hair) ${pct}%, var(--border-hair) 100%)`;
  }

  function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  }

  function calculate() {
    const homeVal = parseFloat(homeValueInput.value) || 0;
    const downPct = parseFloat(downPaymentInput.value) || 0;
    const annualRate = parseFloat(interestRateInput.value) || 0;
    const tenureYears = parseFloat(loanTenureInput.value) || 0;

    const downAmount = homeVal * (downPct / 100);
    const principal = homeVal - downAmount;
    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = tenureYears * 12;

    let monthlyEmi = 0;
    if (monthlyRate > 0) {
      monthlyEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyEmi = principal / totalMonths;
    }

    const totalRepayment = monthlyEmi * totalMonths;
    const totalInterest = Math.max(0, totalRepayment - principal);

    // Update Displays
    homeValueDisplay.textContent = formatCurrency(homeVal);
    downPaymentDisplay.textContent = `${downPct}% (${formatCurrency(downAmount)})`;
    interestRateDisplay.textContent = `${annualRate.toFixed(2)}%`;
    loanTenureDisplay.textContent = `${tenureYears} Years`;

    monthlyEmiOutput.textContent = formatCurrency(monthlyEmi);
    totalPrincipalOutput.textContent = formatCurrency(principal);
    totalInterestOutput.textContent = formatCurrency(totalInterest);
    totalRepaymentOutput.textContent = formatCurrency(totalRepayment);

    // Update breakdown progress bar
    if (barPrincipalSegment && barInterestSegment && totalRepayment > 0) {
      const principalPercent = (principal / totalRepayment) * 100;
      const interestPercent = 100 - principalPercent;
      barPrincipalSegment.style.width = `${principalPercent.toFixed(1)}%`;
      barInterestSegment.style.width = `${interestPercent.toFixed(1)}%`;
    }
  }

  return {
    init: init,
    calculate: calculate
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  MortgageCalculator.init();
});
