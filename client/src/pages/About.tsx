import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BubbleEffect from "../components/BubbleEffect";

interface CreatorCardProps {
  name: string;
  role: string;
  skills: string[];
}

function CreatorCard({ name, role, skills }: CreatorCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10">
              {name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          {skills.map((skill, index) => (
            <li key={index} className="text-muted-foreground">
              {skill}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function About() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <BubbleEffect />
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About the Creators</h1>
          <p className="text-lg text-muted-foreground">
            Meet the team behind WhaleWatch, dedicated to making marine education engaging and accessible.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CreatorCard
            name="Rivers Porper"
            role="UNC Chapel Hill Student"
            skills={[
              "Full-stack Developer",
              "Marine Life Enthusiast"
            ]}
          />
          <CreatorCard
            name="Henry Liu"
            role="UNC Chapel Hill Student"
            skills={[
              "UI/UX Designer",
              "Web Development Specialist"
            ]}
          />
        </div>

        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              WhaleWatch is an interactive educational platform focused on whale facts and ocean knowledge. 
              We aim to make learning about marine life engaging and fun through our beautiful ocean-themed 
              interface and interactive features.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
