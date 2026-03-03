import { useState } from 'react'
import StepHousehold from './StepHousehold.jsx'
import StepIncome from './StepIncome.jsx'
import StepCategories from './StepCategories.jsx'
import StepComplete from './StepComplete.jsx'

const STEPS = [
  { label: 'Household', component: StepHousehold },
  { label: 'Income', component: StepIncome },
  { label: 'Categories', component: StepCategories },
  { label: 'Done', component: StepComplete },
]

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(0)

  const StepComponent = STEPS[step].component
  const isLast = step === STEPS.length - 1

  function next() {
    if (!isLast) setStep(s => s + 1)
    else onComplete()
  }
  function back() {
    if (step > 0) setStep(s => s - 1)
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-brand-600 font-semibold text-lg">
            <span className="text-2xl">🏠</span> FamilyBudget
          </div>
        </div>

        {/* Step progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-brand-500 transition-all duration-500 -z-0"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors
                    ${i < step ? 'bg-brand-600 border-brand-600 text-white'
                      : i === step ? 'bg-white border-brand-500 text-brand-600'
                      : 'bg-white border-slate-200 text-slate-400'}
                  `}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === step ? 'text-brand-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <StepComponent onNext={next} onBack={back} isFirst={step === 0} isLast={isLast} />
        </div>
      </div>
    </div>
  )
}
