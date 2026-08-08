# Amazon Elastic Container Registry (ECR)
# هنا سنقوم بإنشاء مستودعات (Repositories) لرفع صور الدوكر الخاصة بك

# Frontend ECR Repository
resource "aws_ecr_repository" "frontend_repo" {
  name                 = "${var.project_name}-${var.environment}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# Backend ECR Repository
resource "aws_ecr_repository" "backend_repo" {
  name                 = "${var.project_name}-${var.environment}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
