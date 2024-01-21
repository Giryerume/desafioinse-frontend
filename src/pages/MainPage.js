import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./MainPage.css";
import { UFs } from "../components/UFs";
import { Classificacoes } from "../components/Classificacoes";
import {
  serialize,
  nomeArea,
  nomeLocalizacao,
  nomeDependencia,
} from "../components/Utils";

const MainPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");
  const [filtering, setFiltering] = useState({
    SG_UF: "",
    INSE_CLASSIFICACAO: "",
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  Modal.setAppElement('#root');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/inses/?search=${search}&${serialize(
            filtering
          )}&ordering=${ordering}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, filtering, ordering]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const fetchPageData = async (currentPage) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/inses/?search=${search}&${serialize(
        filtering
      )}&ordering=${ordering}&page=${currentPage}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  };

  const fetchSearch = async (name) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/inses/?search=${name}&${serialize(
        filtering
      )}&ordering=${ordering}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    const result = await fetchPageData(currentPage);
    setData(result);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let name = event.target.name.value;
    setSearch(name);
    const result = await fetchSearch(name);
    setData(result);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFiltering((prevDados) => ({
      ...prevDados,
      [name]: value,
    }));
  };

  const handleOrdering = async (col) => {
    if (col === ordering) {
      setOrdering("-" + col);
    } else if ("-" + col === ordering) {
      setOrdering("");
    } else {
      setOrdering(col);
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <div className="busca">
        <form className="d-flex" role="search" onSubmit={handleSubmit}>
          <input
            name="name"
            className="form-control me-2"
            type="search"
            placeholder="Buscar Escola"
            aria-label="Buscar"
          />
          <select
            name="SG_UF"
            className="form-select form-control me-2"
            aria-label="Default select example"
            onChange={handleChange}
          >
            <option value="" selected>
              UF
            </option>
            {UFs.map((uf, index) => (
              <option key={index} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          <select
            name="INSE_CLASSIFICACAO"
            className="form-select form-control me-2"
            aria-label="Default select example"
            onChange={handleChange}
          >
            <option value="" selected>
              Classificação
            </option>
            {Classificacoes.map((classificacao, index) => (
              <option key={index} value={classificacao}>
                {classificacao}
              </option>
            ))}
          </select>
          <button className="btn btn-outline-success" type="submit">
            Buscar
          </button>
        </form>
      </div>
      <table className="table tabela-escolas">
        <thead>
          <tr>
            <th onClick={() => handleOrdering("NO_ESCOLA")}>
              Nome{" "}
              {ordering.includes("NO_ESCOLA") &&
                (ordering.includes("-") ? "▼" : "▲")}
            </th>
            <th onClick={() => handleOrdering("NO_MUNICIPIO")}>
              Município{" "}
              {ordering.includes("NO_MUNICIPIO") &&
                (ordering.includes("-") ? "▼" : "▲")}
            </th>
            <th onClick={() => handleOrdering("SG_UF")}>
              UF{" "}
              {ordering.includes("SG_UF") &&
                (ordering.includes("-") ? "▼" : "▲")}
            </th>
            <th onClick={() => handleOrdering("MEDIA_INSE")}>
              Média INSE{" "}
              {ordering.includes("MEDIA_INSE") &&
                (ordering.includes("-") ? "▼" : "▲")}
            </th>
            <th onClick={() => handleOrdering("INSE_CLASSIFICACAO")}>
              Classificação{" "}
              {ordering.includes("INSE_CLASSIFICACAO") &&
                (ordering.includes("-") ? "▼" : "▲")}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((inse) => (
            <tr key={inse.id}>
              <td>{inse.NO_ESCOLA}</td>
              <td>{inse.NO_MUNICIPIO}</td>
              <td>{inse.SG_UF}</td>
              <td>{inse.MEDIA_INSE}</td>
              <td>{inse.INSE_CLASSIFICACAO}</td>
              <td>
                <button
                  className="btn btn-outline-success"
                  onClick={() => openModal(inse)}
                >
                  Detalhe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        style={customStyles}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onClick={closeModal}
      >
        <div>
          <button
            type="button"
            className="btn-close button"
            aria-label="Close"
            onClick={closeModal}
          ></button>
          {modalContent && (
            <div>
              <h2>
                <small className="text-body-secondary">Escola: </small>
                {modalContent.NO_ESCOLA}
              </h2>
              <br></br>
              <h4>
                <small className="text-body-secondary">Municipio: </small>
                {modalContent.NO_MUNICIPIO}
              </h4>
              <h4>
                <small className="text-body-secondary">UF: </small>
                {modalContent.NO_UF}
              </h4>
              <h4>
                <small className="text-body-secondary">
                  Dependência Administrativa da Escola:{" "}
                </small>{" "}
                {nomeDependencia(modalContent.TP_TIPO_REDE)}
              </h4>
              <h4>
                <small className="text-body-secondary">
                  Localização da Escola:{" "}
                </small>
                {nomeLocalizacao(modalContent.TP_LOCALIZACAO)}
              </h4>
              <h4>
                <small className="text-body-secondary">Área da Escola: </small>{" "}
                {nomeArea(modalContent.TP_CAPITAL)}
              </h4>
              <h4>
                <small className="text-body-secondary">
                  Quantidade de Alunos com INSE Calculado:{" "}
                </small>{" "}
                {modalContent.QTD_ALUNOS_INSE} alunos
              </h4>
              <h4>
                <small className="text-body-secondary">
                  Média do Indicador de Nível Socioeconômico:{" "}
                </small>{" "}
                {modalContent.MEDIA_INSE}
              </h4>
              <h4>
                <small className="text-body-secondary">
                  Classificação do Indicador de Nível Socioeconômico:{" "}
                </small>{" "}
                {modalContent.INSE_CLASSIFICACAO}
              </h4>
              <h4>
                <small className="text-body-secondary">
                  Percentual de Alunos Classificados por Nível:{" "}
                </small>{" "}
              </h4>
              <ul>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível I: </small>{" "}
                    {modalContent.PC_NIVEL_1}%
                  </h5>
                </li>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível II: </small>{" "}
                    {modalContent.PC_NIVEL_2}%
                  </h5>
                </li>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível III: </small>{" "}
                    {modalContent.PC_NIVEL_3}%
                  </h5>
                </li>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível IV: </small>{" "}
                    {modalContent.PC_NIVEL_4}%
                  </h5>
                </li>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível V: </small>{" "}
                    {modalContent.PC_NIVEL_5}%
                  </h5>
                </li>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível VI: </small>{" "}
                    {modalContent.PC_NIVEL_6}%
                  </h5>
                </li>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível VII: </small>{" "}
                    {modalContent.PC_NIVEL_7}%
                  </h5>
                </li>
                <li>
                  <h5>
                    <small className="text-body-secondary">Nível VIII: </small>{" "}
                    {modalContent.PC_NIVEL_8}%
                  </h5>
                </li>
              </ul>
              <div></div>
            </div>
          )}
        </div>
      </Modal>
      <ReactPaginate
        pageCount={Math.ceil(data.count / 100)}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default MainPage;
