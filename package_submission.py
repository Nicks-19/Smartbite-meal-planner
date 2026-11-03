import os
import zipfile

def create_submission_zip():
    project_root = os.path.dirname(os.path.abspath(__file__))
    zip_filename = "202401100018_Nikita_Sharad_Pawar_Project.zip"
    zip_path = os.path.join(project_root, zip_filename)

    # Exclusions
    exclude_dirs = {"node_modules", "__pycache__", ".pytest_cache", ".git", ".vscode"}
    exclude_extensions = {".pyc", ".pyo"}

    print(f"[*] Packaging project into: {zip_path}")
    count = 0

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(project_root):
            # Prune excluded dirs in-place
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                if file == zip_filename:
                    continue
                ext = os.path.splitext(file)[1]
                if ext in exclude_extensions:
                    continue

                abs_file = os.path.join(root, file)
                rel_path = os.path.relpath(abs_file, project_root)
                # Ensure the root folder inside the zip has the clean project name
                archive_name = os.path.join("SmartBite-Meal-Planner", rel_path)
                zf.write(abs_file, archive_name)
                count += 1

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"[SUCCESS] Packaged {count} files into {zip_path} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    create_submission_zip()
