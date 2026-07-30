import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(__dirname, '../README.md');

const PROFILE_URL = process.env.PROFILE_URL ?? 'https://vincentmenzel.com/profile.json';

interface Certification {
  label: string;
  year: string;
  expired?: boolean;
}

interface Profile {
  name: string;
  position: string;
  company: string;
  homepage: string;
  github: string;
  linkedin: string;
  coreStack: string[];
  certifications: Certification[];
  generatedAt: string;
}

// Local badge images kept in this repo per certification label.
// A cert with no entry here still renders as a plain badge, just without an image.
const CERT_IMAGES: Record<string, string> = {
  CKAD: './images/linux_foundation/ckad.png',
};

const CERT_LINKS: Record<string, string> = {
  CKAD: 'https://www.credly.com/earner/earned/badge/c32fa21d-ed9f-471d-8599-a96155826d3f',
};

const res = await fetch(PROFILE_URL);
if (!res.ok) {
  throw new Error(`Failed to fetch ${PROFILE_URL}: ${res.status} ${res.statusText}`);
}
const profile: Profile = await res.json();

const activeCerts = profile.certifications.filter((c) => !c.expired);

const certSection = activeCerts.length
  ? `## Certifications\n\n${activeCerts
      .map((c) => {
        const img = CERT_IMAGES[c.label];
        const link = CERT_LINKS[c.label] ?? profile.homepage;
        return img
          ? `[![${c.label}](${img})](${link}) &emsp;`
          : `[![${c.label}](https://img.shields.io/badge/${encodeURIComponent(c.label)}_${c.year}-333?style=for-the-badge)](${link}) &emsp;`;
      })
      .join('\n')}\n`
  : '';

const readme = `### About Me:
${profile.position} at ${profile.company}. Coding enthusiast on a perpetual adventure to discover and play with new tech and languages! 👨‍💻

[![Portfolio](https://img.shields.io/badge/vincentmenzel.com-black?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem02LjkzIDZoLTIuOTVjLS4zMi0xLjI1LS43OC0yLjQ1LTEuMzgtMy41NiAxLjg0LjYzIDMuMzcgMS45MSA0LjMzIDMuNTZ6TTEyIDQuMDRjLjgzIDEuMiAxLjQ4IDIuNTMgMS45MSAzLjk2aC0zLjgyYy40My0xLjQzIDEuMDgtMi43NiAxLjkxLTMuOTZ6TTQuMjYgMTRDNC4xIDEzLjM2IDQgMTIuNjkgNCAxMnMuMS0xLjM2LjI2LTJoMy4zOGMtLjA4LjY2LS4xNCAxLjMyLS4xNCAycy4wNiAxLjM0LjE0IDJINC4yNnptLjgyIDJoMi45NWMuMzIgMS4yNS43OCAyLjQ1IDEuMzggMy41NkM3LjU3IDE4LjkzIDYuMDQgMTcuNjUgNS4wOCAxNnptMi45NS04SDUuMDhjLjk2LTEuNjUgMi40OS0yLjkzIDQuMzMtMy41NkM4LjgxIDUuNTUgOC4zNSA2Ljc1IDguMDMgOHpNMTIgMTkuOTZjLS44My0xLjItMS40OC0yLjUzLTEuOTEtMy45NmgzLjgyYy0uNDMgMS40My0xLjA4IDIuNzYtMS45MSAzLjk2ek0xNC4zNCAxNEg5LjY2Yy0uMDktLjY2LS4xNi0xLjMyLS4xNi0ycy4wNy0xLjM1LjE2LTJoNC42OGMuMDkuNjUuMTYgMS4zMi4xNiAycy0uMDcgMS4zNC0uMTYgMnptLjI1IDUuNTZjLjYtMS4xMSAxLjA2LTIuMzEgMS4zOC0zLjU2aDIuOTVjLS45NiAxLjY1LTIuNDkgMi45My00LjMzIDMuNTZ6TTE2LjM2IDE0Yy4wOC0uNjYuMTQtMS4zMi4xNC0ycy0uMDYtMS4zNC0uMTQtMmgzLjM4Yy4xNi42NC4yNiAxLjMxLjI2IDJzLS4xIDEuMzYtLjI2IDJoLTMuMzh6Ii8+PC9zdmc+&logoColor=white)](${profile.homepage})
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](${profile.linkedin})
[![Buy me a coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/vincentmenzel)

### Core stack:
${profile.coreStack.map((t) => `\`${t}\``).join(' · ')}

### Other tools I like:
[![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
[![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://www.linux.org/)

### I enjoy doing some coding challenges and stackoverflow answers on the side
[![Stackoverflow](https://img.shields.io/badge/Stack_Overflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white)](https://stackoverflow.com/users/11941549/vincent-menzel)
[![Codingame](https://img.shields.io/badge/CodinGame-F2BB13?style=for-the-badge&logo=codingame&logoColor=white)](https://codingame.com/profile/494eefed5a0393eaae332fa0b4643e849231024)
[![Codewars](https://img.shields.io/badge/Codewars-B1361E?style=for-the-badge&logo=Codewars&logoColor=white)](https://codewars.com/users/VincentMenzel)
[![Leetcode](https://img.shields.io/badge/-LeetCode-FFA116?style=for-the-badge&logo=LeetCode&logoColor=black)](https://leetcode.com/VincentMenzel/)

${certSection}
## My Statistics
[![Vincent's github stats](https://github-readme-stats.vercel.app/api?username=${profile.github}&theme=blueberry&show_icons=true)](${profile.linkedin})
[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${profile.github}&layout=compact)](${profile.linkedin})

<!-- Auto-generated from ${PROFILE_URL} by scripts/generate-readme.ts — do not edit by hand.
Last synced: ${profile.generatedAt} -->
`;

fs.writeFileSync(outFile, readme);
console.log(`Wrote ${outFile}`);
