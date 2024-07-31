CREATE DATABASE trabalho_faculdade;
CREATE TABLE trabalho_faculdade.resultados(
id INT AUTO_INCREMENT,
dt_registro timestamp default CURRENT_TIMESTAMP,
nome VARCHAR(99) NOT NULL,
tentativas INT NOT NULL,
primary key(id)
);

CREATE TABLE IF NOT EXISTS trabalho_faculdade.`resultados_binarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dt_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `nome` varchar(99) NOT NULL,
  `tentativas` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


select id, dt_registro, nome, tentativas from trabalho_faculdade.resultados order by tentativas asc limit 50;
select id, dt_registro, nome, tentativas from trabalho_faculdade.resultados_binarios order by tentativas asc limit 50;

insert into trabalho_faculdade.resultados (nome,tentativas) values( ?, ?);
insert into trabalho_faculdade.resultados_binarios (nome,tentativas) values( ?, ?);