# Amazon Elastic Container Service (ECS)
# هذا الملف سيكون مسؤولاً عن تشغيل حاويات الدوكر الخاصة بك باستخدام Fargate

# 1. إنشاء الـ Cluster
resource "aws_ecs_cluster" "main_cluster" {
  name = "${var.project_name}-${var.environment}-cluster"
}

# ملاحظة لك: 
# لاحقاً ستقوم هنا بإضافة:
# 1. aws_ecs_task_definition (لتعريف كيف تعمل الحاوية، الرامات، المعالج، الخ)
# 2. aws_ecs_service (للتأكد من أن الحاوية تعمل دائماً وربطها بالـ Load Balancer)
