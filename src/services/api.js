const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://bisindo-api-production.up.railway.app/predict";

export async function predictSign(imageBlob) {
  const formData = new FormData();
  formData.append("file", imageBlob, "bisindo-frame.jpg");

  let response;

  try {
    response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });
  } catch {
    throw new Error("Gagal menghubungi API");
  }

  if (!response.ok) {
    throw new Error("Gagal menghubungi API");
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Response API tidak sesuai format");
  }

  if (
    typeof data?.predicted_label !== "string" ||
    typeof data?.confidence !== "number" ||
    !Array.isArray(data?.top3)
  ) {
    throw new Error("Response API tidak sesuai format");
  }

  return data;
}
