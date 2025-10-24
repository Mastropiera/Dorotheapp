
"use client"; // si quieres usar hooks de React

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Oops! Algo salió mal.</h2>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  );
}
