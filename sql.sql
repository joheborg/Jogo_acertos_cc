CREATE DATABASE `trabalho_faculdade`;
CREATE TABLE IF NOT EXISTS `trabalho_faculdade`.`resultados`(
    `id` INT AUTO_INCREMENT,
    `dt_registro` timestamp default CURRENT_TIMESTAMP,
    `nome` VARCHAR(99) NOT NULL,
    `tentativas` INT default null,
    `numero` INT NOT NULL,
    `acertou` tinyint not null default 0,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS `trabalho_faculdade`.`resultados_binarios` (
    `id` int AUTO_INCREMENT,
    `dt_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `nome` varchar(99) NOT NULL,
    `tentativas` int default null,
    `numero` int NOT NULL,
    `acertou` tinyint not null default 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP PROCEDURE IF EXISTS trabalho_faculdade.GRAVARRESULTADO;
DELIMITER $$

CREATE PROCEDURE trabalho_faculdade.GRAVARRESULTADO(
    IN tipo VARCHAR(50), 
    IN vnome VARCHAR(255), 
    OUT resultado_id INT
)
BEGIN
    DECLARE last_id INT;

    START TRANSACTION;

    BEGIN
        IF tipo = 'BINARIO' THEN
            INSERT INTO trabalho_faculdade.resultados_binarios (nome, numero)
            VALUES (vnome, GERARNUMERORANDOM());
            SET last_id = LAST_INSERT_ID();
        ELSE
            INSERT INTO trabalho_faculdade.resultados (nome, numero)
            VALUES (vnome, GERARNUMERORANDOM());
            SET last_id = LAST_INSERT_ID();
        END IF;

        SET resultado_id = last_id;

        COMMIT;
    END;

END $$

DELIMITER ;



DROP PROCEDURE IF EXISTS `trabalho_faculdade`.`GRAVARTENTATIVAS`;
DELIMITER $$

CREATE PROCEDURE `trabalho_faculdade`.`GRAVARTENTATIVAS`(
    IN vid INT,
    IN tipo TEXT
)
BEGIN
    IF tipo = 'BINARIO' THEN
        UPDATE 
            trabalho_faculdade.resultados_binarios
        SET
            TENTATIVAS = (coalesce(TENTATIVAS,0) + 1)
        WHERE
            ID = vid;
        
    ELSE
        UPDATE 
            trabalho_faculdade.resultados
        SET
            TENTATIVAS = (coalesce(TENTATIVAS,0) + 1 )
        WHERE
            ID = vid;
        
    END IF;

END $$

DELIMITER ;



DROP FUNCTION IF EXISTS `trabalho_faculdade`.`GERARNUMERORANDOM`;
DELIMITER $$
CREATE FUNCTION `trabalho_faculdade`.`GERARNUMERORANDOM`()
RETURNS INT
LANGUAGE SQL
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    RETURN (FLOOR(RAND() * 100) + 1);
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `trabalho_faculdade`.`VERIFICARNUMERORANDOM`;
DELIMITER $$

CREATE PROCEDURE `trabalho_faculdade`.`VERIFICARNUMERORANDOM`(
    IN NUMEROBIN INT,
    IN VNUMERO INT,
    IN IDRESULTADO INT,
    OUT RESULTADO varchar(128)
)
BEGIN
    SET RESULTADO = NULL;

    IF NUMEROBIN > 0 THEN
        SELECT coalesce(
            (select id
        FROM resultados_binarios
        WHERE ID = IDRESULTADO
          AND NUMERO = NUMEROBIN
        LIMIT 1)
        , (select if(rb.numero > NUMEROBIN, '+', '-') from resultados_binarios AS rb where rb.id = IDRESULTADO)) INTO RESULTADO
        ;

        CALL `trabalho_faculdade`.`GRAVARTENTATIVAS`(IDRESULTADO, 'BINARIO');
        IF RESULTADO != '+' AND RESULTADO != '-' THEN
            UPDATE resultados_binarios SET ACERTOU = 1 WHERE ID = IDRESULTADO;
        END IF;

    ELSE
        SELECT coalesce(
            (select id
        FROM resultados
        WHERE ID = IDRESULTADO
          AND NUMERO = VNUMERO
        LIMIT 1)
        , (select if(r.numero > VNUMERO, '+', '-') from resultados AS r WHERE r.id = IDRESULTADO)) INTO RESULTADO;

        CALL `trabalho_faculdade`.`GRAVARTENTATIVAS`(IDRESULTADO, 'NORMAL');
        IF RESULTADO != '+' AND RESULTADO != '-' THEN
            UPDATE resultados SET ACERTOU = 1 WHERE ID = IDRESULTADO;
        END IF;
    END IF;

END $$

DELIMITER ;

