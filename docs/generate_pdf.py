import os
import subprocess
import sys

def generate_pdf():
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(docs_dir)
    html_file = os.path.join(docs_dir, "project_report.html")

    # Target PDF filename matching assignment prompt: PRN_Name_Project.pdf
    pdf_filename = "202401100018_Nikita_Sharad_Pawar_Project.pdf"
    output_pdf = os.path.join(project_root, pdf_filename)
    docs_pdf = os.path.join(docs_dir, pdf_filename)

    # Browser executable paths
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

    browser_bin = None
    if os.path.exists(edge_path):
        browser_bin = edge_path
    elif os.path.exists(chrome_path):
        browser_bin = chrome_path

    if not browser_bin:
        print("[ERROR] Neither Microsoft Edge nor Google Chrome was found for PDF rendering.")
        sys.exit(1)

    print(f"[*] Rendering HTML documentation to PDF using: {browser_bin}")
    print(f"[*] Input:  {html_file}")
    print(f"[*] Output: {output_pdf}")

    file_url = "file:///" + html_file.replace("\\", "/")

    cmd = [
        browser_bin,
        "--headless=new",
        "--disable-gpu",
        f"--print-to-pdf={output_pdf}",
        "--no-pdf-header-footer",
        file_url
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if os.path.exists(output_pdf) and os.path.getsize(output_pdf) > 1000:
        # Also copy to docs directory
        import shutil
        shutil.copy2(output_pdf, docs_pdf)
        size_kb = os.path.getsize(output_pdf) / 1024
        print(f"[SUCCESS] PDF Generated Successfully: {output_pdf} ({size_kb:.1f} KB)")
        print(f"[SUCCESS] Also saved copy in: {docs_pdf}")
    else:
        print(f"[ERROR] PDF generation failed: {result.stderr}")
        sys.exit(1)

if __name__ == "__main__":
    generate_pdf()
