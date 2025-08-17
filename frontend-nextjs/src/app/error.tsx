"use client";

export default function GlobalError({ error }: { error: Error }) {
  console.error("Global Error:", error);

  return (
    <html>
      <body className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-lg font-semibold text-red-600">Unexpected Error</h2>
        <p className="text-sm text-muted-foreground">Please reload the page.</p>
      </body>
    </html>
  );
}
