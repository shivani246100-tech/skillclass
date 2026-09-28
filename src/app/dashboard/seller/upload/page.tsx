"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

export default function SellerPdfUploadPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    author: "",
    language: "",
    categoryId: "",
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a PDF file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("author", form.author);
    formData.append("language", form.language);
    formData.append("categoryId", form.categoryId);

    try {
      const response = await fetch(
        "/api/seller/pdf-books",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setMessage(
        "PDF uploaded successfully! It is now waiting for Admin approval."
      );

      setForm({
        title: "",
        description: "",
        price: "",
        author: "",
        language: "",
        categoryId: "",
      });

      setFile(null);

      const input = document.getElementById(
        "pdf-file"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div
        className="container"
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <Link href="/dashboard/seller">
            ← Back to Seller Dashboard
          </Link>
        </div>

        <div className="feature-panel">
          <div style={{ marginBottom: "28px" }}>
            <p
              className="muted"
              style={{
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              SELLER CENTER
            </p>

            <h1>Upload PDF Book</h1>

            <p className="muted">
              Upload your educational PDF and submit it for
              Admin approval.
            </p>
          </div>

          {message && (
            <div
              style={{
                padding: "14px 16px",
                marginBottom: "20px",
                borderRadius: "10px",
                background: "#ecfdf5",
                color: "#065f46",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "14px 16px",
                marginBottom: "20px",
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#991b1b",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label>
                <strong>PDF File</strong>
              </label>

              <input
                id="pdf-file"
                type="file"
                accept="application/pdf,.pdf"
                required
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                }}
              />

              <small className="muted">
                PDF only • Maximum 20MB
              </small>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label>
                <strong>Book Title</strong>
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Class 10 Mathematics Notes"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label>
                <strong>Description</strong>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what students will get in this PDF..."
                rows={5}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
                marginBottom: "18px",
              }}
            >
              <div>
                <label>
                  <strong>Price (₹)</strong>
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Example: 99"
                  min="1"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                  }}
                />
              </div>

              <div>
                <label>
                  <strong>Author</strong>
                </label>

                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                  }}
                />
              </div>

              <div>
                <label>
                  <strong>Language</strong>
                </label>

                <input
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  placeholder="Hindi / English"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                  }}
                />
              </div>

              <div>
                <label>
                  <strong>Category</strong>
                </label>

                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                  }}
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                marginBottom: "22px",
                borderRadius: "10px",
                background: "#f8fafc",
              }}
            >
              <strong>💰 Earnings</strong>

              <p className="muted">
                SkillClass retains 10% platform commission.
                You receive 90% of approved sales.
              </p>

              <p className="muted">
                Example: ₹100 sale → ₹10 commission → ₹90
                seller earning.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
              }}
            >
              {loading
                ? "Uploading PDF..."
                : "Upload & Submit for Approval"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}