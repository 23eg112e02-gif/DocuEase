export const DOCUMENT_TEMPLATES = [
  {
    id: 'blank',
    title: 'Blank Document',
    description: 'Start from scratch with a clean slate',
    icon: 'File',
    content: ''
  },
  {
    id: 'meeting-notes',
    title: 'Meeting Notes',
    description: 'Structure agendas, attendees, and action items',
    icon: 'Users',
    content: `<h1>Meeting Notes</h1>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Attendees:</strong> Person 1, Person 2, Person 3</p>
<hr>
<h2>1. Agenda</h2>
<ul>
  <li>Review project milestones</li>
  <li>Sprint roadmap & deliverables</li>
  <li>Open discussion & blockers</li>
</ul>
<h2>2. Discussion Notes</h2>
<p>Key points discussed during the sync:</p>
<ul>
  <li>Architecture migration on schedule for next release.</li>
  <li>New collaboration engine tested and deployed.</li>
</ul>
<h2>3. Action Items</h2>
<ul data-type="taskList">
  <li data-type="taskItem"><label><input type="checkbox"></label><div>Follow up on database indexes</div></li>
  <li data-type="taskItem"><label><input type="checkbox"></label><div>Review pull request for export service</div></li>
  <li data-type="taskItem"><label><input type="checkbox"></label><div>Schedule customer feedback session</div></li>
</ul>`
  },
  {
    id: 'project-proposal',
    title: 'Project Proposal',
    description: 'Pitch ideas, scope, timeline, and goals',
    icon: 'Briefcase',
    content: `<h1>Project Proposal: NextGen Cloud Collaboration</h1>
<p><em>Prepared by: DocuEase Product Team</em></p>
<hr>
<h2>Executive Summary</h2>
<p>This proposal outlines the initiative to build high-performance real-time collaboration with instant guest access and enterprise account persistence.</p>
<h2>Project Objectives</h2>
<ul>
  <li>Provide sub-second real-time multi-cursor document editing.</li>
  <li>Ensure 99.9% uptime with independent client/server architectures.</li>
  <li>Offer export capabilities across PDF, Word, and Markdown.</li>
</ul>
<h2>Timeline & Milestones</h2>
<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Deliverable</th>
      <th>Target Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Phase 1</td>
      <td>Core Editor & Formatting Suite</td>
      <td>Month 1</td>
    </tr>
    <tr>
      <td>Phase 2</td>
      <td>WebSocket Real-time Engine</td>
      <td>Month 2</td>
    </tr>
    <tr>
      <td>Phase 3</td>
      <td>Production Deploy & Scaling</td>
      <td>Month 3</td>
    </tr>
  </tbody>
</table>
<h2>Budget & Resources</h2>
<p>Estimated infrastructure and developer requirements...</p>`
  },
  {
    id: 'resume',
    title: 'Modern Resume',
    description: 'Professional CV layout with experience & skills',
    icon: 'UserCheck',
    content: `<h1>Alex Johnson</h1>
<p><strong>Senior Software Engineer</strong> | alex.johnson@example.com | (555) 019-2834 | San Francisco, CA</p>
<hr>
<h2>Professional Summary</h2>
<p>Full-stack software architect with 6+ years of experience building high-scale cloud platforms, distributed systems, and modern rich text collaborative tools.</p>
<h2>Experience</h2>
<h3>Lead Engineer &bull; CloudTech Inc.</h3>
<p><em>Jan 2023 &ndash; Present</em></p>
<ul>
  <li>Led team of 8 engineers architecting real-time collaboration platforms serving 200k+ active users.</li>
  <li>Reduced document synchronization latency by 45% using CRDTs and WebSockets.</li>
</ul>
<h3>Full Stack Developer &bull; DevSolutions</h3>
<p><em>Jun 2020 &ndash; Dec 2022</em></p>
<ul>
  <li>Engineered REST APIs and React single-page applications deployed on cloud infrastructures.</li>
  <li>Integrated automated document parsing and multi-format PDF/DOCX exporters.</li>
</ul>
<h2>Skills</h2>
<p><strong>Languages:</strong> JavaScript, TypeScript, Python, HTML5, CSS3/Tailwind</p>
<p><strong>Frameworks & Tools:</strong> React, Node.js, Express, MongoDB, Vite, Docker, WebSockets, Git</p>
<h2>Education</h2>
<p><strong>B.S. in Computer Science</strong> &bull; University of Technology &bull; 2016 - 2020</p>`
  },
  {
    id: 'weekly-report',
    title: 'Weekly Status Report',
    description: 'Progress updates, accomplishments, and next steps',
    icon: 'Calendar',
    content: `<h1>Weekly Status Report</h1>
<p><strong>Week Ending:</strong> ${new Date().toLocaleDateString()} &bull; <strong>Lead:</strong> Product Engineering</p>
<hr>
<h2>&check; Highlights & Key Accomplishments</h2>
<ul>
  <li>Completed Google Docs clone feature set with table and image support.</li>
  <li>Configured seamless split deployment for Vercel and Render.</li>
  <li>Implemented guest-to-account frictionless migration flow.</li>
</ul>
<h2>&target; Current Sprint Goals</h2>
<ul data-type="taskList">
  <li data-type="taskItem"><label><input type="checkbox" checked></label><div>Verify cross-origin JWT cookie fallback</div></li>
  <li data-type="taskItem"><label><input type="checkbox" checked></label><div>Add table column/row manipulation</div></li>
  <li data-type="taskItem"><label><input type="checkbox"></label><div>Conduct load testing on WebSocket rooms</div></li>
</ul>
<h2>&excl; Risks & Blockers</h2>
<p>None identified at this time.</p>`
  }
];
