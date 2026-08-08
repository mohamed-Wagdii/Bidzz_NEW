# هذا الملف الرئيسي (Main)
# عادة نضع فيه الأشياء الأساسية مثل الشبكات (VPC) إذا لم تكن في ملف منفصل
# بما أننا في البداية، يمكننا استخدام الـ Default VPC الخاص بحساب AWS الخاص بك لتسهيل الأمور

# جلب الـ Default VPC
data "aws_vpc" "default" {
  default = true
}

# جلب الـ Subnets الافتراضية
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
