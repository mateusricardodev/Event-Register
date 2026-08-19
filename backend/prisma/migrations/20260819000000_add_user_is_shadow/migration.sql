-- Marca contas-placeholder criadas para participantes sem login (inscrição
-- pública ou lançada pelo organizador). Linhas existentes ficam com false
-- por padrão: não há como distinguir com segurança, a partir dos dados
-- já gravados, uma conta-sombra antiga de uma conta real — então o valor
-- seguro é "não propagar" até a inscrição ser tocada de novo.
ALTER TABLE "User" ADD COLUMN "isShadow" BOOLEAN NOT NULL DEFAULT false;
