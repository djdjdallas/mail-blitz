"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useTemplate } from "@/app/context/TemplateContext";
import { useRouter } from "next/navigation";
import {
  BicepsFlexed,
  Handshake,
  Smile,
  GraduationCap,
  Star,
} from "lucide-react";

export default function EmailTemplatesPage() {
  const [selectedTone, setSelectedTone] = useState("all");
  const [emailTemplates, setEmailTemplates] = useState([]);
  const supabase = createClientComponentClient();
  const { setSelectedTemplate } = useTemplate();
  const router = useRouter();

  useEffect(() => {
    const fetchEmailTemplates = async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("tone", { ascending: true });

      if (error) {
        console.error("Error fetching email templates:", error);
      } else {
        // Sort to have Popular first, if exists
        const sortedTemplates = data.sort((a, b) =>
          a.tone === "Popular" ? -1 : b.tone === "Popular" ? 1 : 0
        );
        setEmailTemplates(sortedTemplates);
      }
    };

    fetchEmailTemplates();
  }, [supabase]);

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    router.push(`/dashboard/scripts/${template.id}`);
  };

  const filteredTemplates =
    selectedTone === "all"
      ? emailTemplates
      : emailTemplates.filter(
          (template) =>
            template.tone.toLowerCase() === selectedTone.toLowerCase()
        );

  return (
    <div className="container mx-auto py-12 grid grid-cols-[250px_1fr] gap-8">
      <div className="bg-background rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Filter by Tone</h2>
        <div className="space-y-2">
          <Button
            variant={selectedTone === "all" ? "solid" : "outline"}
            onClick={() => setSelectedTone("all")}
            className="w-full justify-start"
          >
            All
          </Button>
          <Button
            variant={selectedTone === "professional" ? "solid" : "outline"}
            onClick={() => setSelectedTone("professional")}
            className="w-full justify-start"
          >
            Professional
          </Button>
          <Button
            variant={selectedTone === "confident" ? "solid" : "outline"}
            onClick={() => setSelectedTone("confident")}
            className="w-full justify-start"
          >
            Confident
          </Button>
          <Button
            variant={selectedTone === "friendly" ? "solid" : "outline"}
            onClick={() => setSelectedTone("friendly")}
            className="w-full justify-start"
          >
            Friendly
          </Button>
          <Button
            variant={selectedTone === "formal" ? "solid" : "outline"}
            onClick={() => setSelectedTone("formal")}
            className="w-full justify-start"
          >
            Formal
          </Button>
          <Button
            variant={selectedTone === "popular" ? "solid" : "outline"}
            onClick={() => setSelectedTone("popular")}
            className="w-full justify-start"
          >
            Popular
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-background rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-center h-48">
              {template.tone === "Confident" && <BicepsFlexed size={48} />}
              {template.tone === "Professional" && <Handshake size={48} />}
              {template.tone === "Friendly" && <Smile size={48} />}
              {template.tone === "Formal" && <GraduationCap size={48} />}
              {template.tone === "Popular" && <Star size={48} />}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{template.title}</h3>
              <p className="text-muted-foreground mb-4">
                {template.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium bg-muted px-2 py-1 rounded-md">
                  {template.tone}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
