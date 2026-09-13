import { timeline, timelineYears } from '../content/timeline.js'
import { endpointLabel, timelineGeometry, timelineHeight, timelinePosition } from '../lib/timeline.js'
import './ExperienceTimeline.css'

export default function ExperienceTimeline() {
  return (
    <section className="experience" aria-labelledby="experience-heading">
      <h2 id="experience-heading" className="section-heading">Experience</h2>
      <div className="experience-labels" aria-hidden="true"><span>Work</span><span>Education</span></div>
      <div className="experience-chart" style={{ '--timeline-height': `${timelineHeight(timeline)}rem` }}>
        <div className="experience-axis" aria-hidden="true">
          {timelineYears.map((year) => <span key={year} style={{ top: `${timelinePosition(year)}%` }}>{year}</span>)}
        </div>
        <ol className="experience-items">
          {timeline.map((item) => {
            const { center, top, height } = timelineGeometry(item)
            return (
              <li key={item.id} className={`experience-item ${item.category.toLowerCase()} ${item.id}`}
                style={{ '--tile-center': `${center}%`, '--range-top': `${top}%`, '--range-height': `${height}%` }}>
                <div className="experience-range" aria-hidden="true">
                  <span className="range-end">{endpointLabel(item.endYear, item.endMonth)}</span>
                  <span className="range-start">{endpointLabel(item.startYear, item.startMonth)}</span>
                </div>
                <article>
                  <p className="experience-category">{item.category} <span> / {item.period}</span></p>
                  <p className="experience-company">{item.company}</p>
                  <h3>{item.role}</h3>
                  <p>{item.description}</p>
                  {item.detail && <p className="experience-detail">{item.detail}</p>}
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
