"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTemplate } from "@/app/context/TemplateContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ViewTemplate() {
  const router = useRouter();
  const { template } = useTemplate();
  const [emailTemplate, setEmailTemplate] = useState(null);

  useEffect(() => {
    if (template) {
      setEmailTemplate(template);
    } else {
      router.push("/dashboard/scripts");
    }
  }, [template, router]);

  const handleComposeEmail = () => {
    router.push("/dashboard/compose-email");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
            Customize Your Email Template
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
            Craft the perfect email to engage your SaaS customers. Edit the
            content and preview the changes before sending.
          </p>
        </div>
        <div className="mt-8 w-full max-w-4xl mx-auto">
          <Textarea
            placeholder="Type your email content here..."
            className="h-[400px] w-full resize-none rounded-lg border border-input bg-background p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            defaultValue={emailTemplate?.body.replace(/\n/g, "<br>") || ""}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline">Preview</Button>
            <Button onClick={handleComposeEmail}>Compose Email</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
