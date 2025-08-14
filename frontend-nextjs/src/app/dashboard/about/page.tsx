import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-bold">About Me</h1>
        <p className="text-lg text-muted-foreground">
          I’m Ahsanullah Faizy, a Full Stack Developer with over 4 years of
          experience in building scalable and secure web applications. I
          specialize in Laravel, React, and Next.js, and have a proven track
          record in delivering quality projects for government and private
          sectors.
        </p>
      </section>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Work Experience</h2>
          <div>
            <h3 className="text-xl font-medium">
              Full Stack Developer – Ministry of Higher Education
            </h3>
            <p className="text-sm text-muted-foreground">
              Kabul, 06/2024 – 05/2025
            </p>
            <p>
              Built and deployed infrastructure directorate project
              successfully.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              Full Stack Developer – Ministry of Transport
            </h3>
            <p className="text-sm text-muted-foreground">
              Kandahar, 08/2023 – 05/2024
            </p>
            <p>
              Designed and maintained a secure web-based transportation
              management system.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              Full Stack Developer – sky Software House
            </h3>
            <p className="text-sm text-muted-foreground">
              Kandahar, 02/2022 – 06/2023
            </p>
            <p>
              Delivered client projects and contributed to scalable app
              development.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Laravel",
              "React",
              "Next.js",
              "TypeScript",
              "JavaScript",
              "PHP",
              "Node.js",
              "Express",
              "MongoDB",
              "PostgreSQL",
              "Tailwind CSS",
              "Shadcn",
              "Material UI",
              "Docker",
              "Kubernetes",
            ].map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Education & Certifications</h2>
          <p>Bachelor of Computer Science, Kandahar University (2019 – 2023)</p>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>React, Next.js, TypeScript – Udemy (Maximillian)</li>
            <li>Laravel – KabulKa (2020)</li>
            <li>Docker & Kubernetes – Udemy</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Key Achievements</h2>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>
              Led a team of 5 developers and completed a project ahead of
              schedule.
            </li>
            <li>
              Boosted system efficiency by 30% through project optimization.
            </li>
            <li>Developed 3 high-performing apps in 6 months.</li>
          </ul>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          Email:{" "}
          <a
            href="mailto:ihsanullahyasar70@gmail.com"
            className="text-blue-600 underline"
          >
            ihsanullahyasar70@gmail.com
          </a>
        </p>
        <p>Phone: 0764617219 / 0700743748</p>
        <p>Location: Kabul, Afghanistan</p>
        <Link href="https://github.com/Ihsanullah-Yasar" target="_blank">
          <Button variant="outline">View GitHub</Button>
        </Link>
      </section>
    </main>
  );
}
