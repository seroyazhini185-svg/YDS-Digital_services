import { Atom, Braces, Terminal, Zap, Coffee, Database, Code2, Github } from 'lucide-react'

const technicalSkills = [
  { name: 'React', icon: Atom },
  { name: 'JavaScript', icon: Braces },
  { name: 'Python', icon: Terminal },
  { name: 'FastAPI', icon: Zap },
  { name: 'Java', icon: Coffee },
  { name: 'PostgreSQL', icon: Database },
  { name: 'HTML/CSS', icon: Code2 },
  { name: 'Git/GitHub', icon: Github },
]

const professionalSkills = [
  'Communication',
  'Data management',
  'Documentation',
  'Problem solving',
  'Quality checking',
  'Project coordination',
  'Time management',
]

export default function Skills() {
  return (
    <div className="page skills">
      <section className="section">
        <h1>Skills</h1>

        <h2>Technical Skills</h2>
        <div className="skill-tools">
          {technicalSkills.map((skill) => {
            const Icon = skill.icon
            return (
              <div className="skill-tool" key={skill.name}>
                <Icon size={28} className="skill-tool-icon" />
                <span className="skill-tool-name">{skill.name}</span>
              </div>
            )
          })}
        </div>

        <h2>Professional Skills</h2>
        <ul className="check-list">
          {professionalSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
