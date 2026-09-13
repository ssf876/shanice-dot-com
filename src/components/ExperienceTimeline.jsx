import { timeline, timelineYears } from '../content/timeline.js'
import './ExperienceTimeline.css'

export default function ExperienceTimeline() {
  return (
    <section className="experience" aria-labelledby="experience-heading">
      <h2 id="experience-heading" className="section-heading">Experience</h2>
      <div className="experience-labels" aria-hidden="true"><span>Work</span><span>Education</span></div>
      <div className="experience-chart">
        <div className="experience-axis" aria-hidden="true">
          {timelineYears.map((year, index) => <span key={year} style={{ gridRow: index + 1 }}>{year}</span>)}
        </div>
        <div className="experience-ranges" aria-hidden="true">
          {timeline.filter((item) => item.end > item.start).map((item) => (
            <span key={item.id} className={`experience-range ${item.category.toLowerCase()}`}
              style={{ gridRow: `${item.start} / ${item.end + 1}` }} />
          ))}
        </div>
        <ol className="experience-items">
          {timeline.map((item) => (
            <li key={item.id} className={`experience-item ${item.category.toLowerCase()} ${item.id}`} style={{ gridRow: item.row }}>
              <article>
                <p className="experience-category">{item.category} <span> / {item.period}</span></p>
                <p className="experience-company">{item.company}</p>
                <h3>{item.role}</h3>
                <p>{item.description}</p>
                {item.detail && <p className="experience-detail">{item.detail}</p>}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
