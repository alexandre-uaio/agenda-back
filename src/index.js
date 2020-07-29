const express = require("express");
const cors = require("cors");
const { request, response } = require("express"); //Adiciona suport a Express
const mariadb = require("mariadb"); //Adiciona Suporte a Mariadb

const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "456008",
  database: "agendamissa",
  connectionLimit: 5,
});

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", async (request, response) => {
  let conn;
  let vjson;
  try {
    conn = await pool.getConnection();
    console.log(conn.info);
    console.log("obtendo Registros");
    const rows = await conn.query("SELECT * from time_missa");

    console.log(rows.length);

    vjson = rows;

    response.send(vjson[0].assento);

    //const res = await conn.query("insert into time_missa (datamissa,horamissa,comunidade,nome, celular, assento,id,idade)  values('21/07/2019','19:00:00','aroquia de Fatima','Alexandre','988410304','A6',2,42);", [1, "mariadb"]);
    //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});

app.get("/missas", async (request, response) => {
  let conn;
  const query = request.query;

  if (
    query.datamissa == "" ||
    query.horamissa == "" ||
    query.comunidade == ""
  ) {
    response.status(400).json({ erro: "02", message: "Parâmetros inválidos" });
    return;
  } else {
    try {
      conn = await pool.getConnection();
      console.log("obtendo Registros");

      const sql =
        "SELECT * from time_missa where datamissa='" +
        query.datamissa +
        "' and horamissa='" +
        query.horamissa +
        "' and comunidade='" +
        query.comunidade +
        "'";
      const rows = await conn.query(sql);

      console.log(rows.length);
      if (rows.length > 0) {
        response.status(200).send(rows);
      } else {
        response
          .status(400)
          .json({ erro: "01", message: "Não existem registros" });
      }
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  }
});

app.post("/missa", async (request, response) => {
  let conn;
  const query = request.body;

  if (
    query.datamissa == "" ||
    query.horamissa == "" ||
    query.comunidade == "" ||
    query.nome == "" ||
    query.celular == "" ||
    query.assento == "" ||
    query.idade == ""
  ) {
    response.status(400).json({ erro: "02", message: "Parâmetros inválidos" });
    return;
  } else {
    try {
      conn = await pool.getConnection();
      console.log("obtendo Registros");

      const sql =
        "insert into time_missa (datamissa,horamissa,comunidade,nome, celular, assento,id,idade)  values('" +
        query.datamissa +
        "','" +
        query.horamissa +
        "','" +
        query.comunidade +
        "','" +
        query.nome +
        "','" +
        query.celular +
        "','" +
        query.assento +
        "',null," +
        query.idade +
        ")";

      const resp = await conn.query(sql, [1, "mariadb"]);

      console.log(resp);

      if (resp.affectedRows > 0) {
        response
          .status(200)
          .json({ erro: "0", message: "Adicionado com sucesso!" });
      } else {
        response
          .status(400)
          .json({ erro: "01", message: "Falha na inclusão do registro" });
      }
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  }
});

app.put("/missa/:id", async (request, response) => {
  let conn;
  const query = request.params;
  const { presente } = request.body;

  if (query.id == "") {
    response.status(400).json({ erro: "01", message: "Parâmetros inválidos" });
    return;
  } else {
    try {
      conn = await pool.getConnection();
      console.log("obtendo Registros");

      const sql =
        "update time_missa set presente=" + presente + " where id=" + query.id;

      const resp = await conn.query(sql, [1, "mariadb"]);

      console.log(resp);

      if (resp.affectedRows > 0) {
        response
          .status(200)
          .json({ erro: "0", message: "Confirmado com sucesso!" });
      } else {
        response
          .status(400)
          .json({ erro: "02", message: "Falha na confimação do registro" });
      }
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  }
});

app.delete("/missa/:id", async (request, response) => {
  let conn;
  const query = request.params;

  if (query.id == "") {
    response.status(400).json({ erro: "01", message: "Parâmetros inválidos" });
    return;
  } else {
    try {
      conn = await pool.getConnection();
      console.log("obtendo Registros");

      const sql = "delete from time_missa where id=" + query.id;

      const resp = await conn.query(sql, [1, "mariadb"]);

      console.log(resp);

      if (resp.affectedRows > 0) {
        response
          .status(200)
          .json({ erro: "0", message: "Removido com sucesso!" });
      } else {
        response
          .status(400)
          .json({ erro: "02", message: "Falha na exclusão do registro" });
      }
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  }
});

app.get("/allmissas", async (request, response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("obtendo Registros");
    const rows = await conn.query("SELECT * from time_missa");

    console.log(rows.length);
    if (rows.length > 0) {
      response.status(200).send(rows);
      console.log(rows);
    } else {
      response
        .status(400)
        .json({ erro: "01", message: "Não existem registros" });
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});

app.listen(3333, () => {
  console.log("✔ Back-end Inciado!");
  //asyncFunction();
});

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log(conn.info);
    console.log("obtendo Registros");
    const rows = await conn.query("SELECT * from time_missa");
    console.log("Exibindo Registros");
    console.log(rows); //[ {val: 1}, meta: ... ]
    const res = await conn.query(
      "insert into time_missa (datamissa,horamissa,comunidade,nome, celular, assento,id,idade)  values('21/07/2019','19:00:00','aroquia de Fatima','Alexandre','988410304','A6',2,42);",
      [1, "mariadb"]
    );
    //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}
