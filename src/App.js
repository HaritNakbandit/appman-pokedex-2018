import React, { useState, useEffect } from 'react'
import './App.css'
import IcHappiness from './cute.png'

const COLORS = {
  Psychic: "#f8a5c2",
  Fighting: "#f0932b",
  Fairy: "#c44569",
  Normal: "#f6e58d",
  Grass: "#badc58",
  Metal: "#95afc0",
  Water: "#3dc1d3",
  Lightning: "#f9ca24",
  Darkness: "#574b90",
  Colorless: "#FFF",
  Fire: "#eb4d4b"
}

const App = () => {
  const [data, setData] = useState([]);
  const [dataDax, setdataDax] = useState(localStorage.getItem("dataDax") ? JSON.parse(localStorage.getItem("dataDax")) : []);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    fetch(
      "http://localhost:3030/api/cards")
      .then((res) => res.json())
      .then((json) => {
        setData(json.cards);
      })
  }, [])

  const onIsOpenModal = (value) => (e) => {
    setIsOpenModal(value);
  }

  const onAddCard = (value) => () => {
    setdataDax([...dataDax, value]);
    localStorage.setItem("dataDax", JSON.stringify([...dataDax, value]));

  };

  const onDeleteCard = (index) => () => {
    dataDax.splice(index, 1);
    setdataDax([...dataDax]);
    localStorage.setItem("dataDax", JSON.stringify([...dataDax]));
  };

  return (
    <div className="App">
      <div className="header">
        <h2>My Pokédex</h2>
      </div>
      <div className="grid-container">
        {dataDax?.map((item, index) => (
          <div key={index} className="card">
            <div >
              <img src={item.imageUrl} alt={""} height={250}></img>
              <div className="detail-wrepper">
                <div className='action-wrepper'>
                  <p>{item.name}</p>
                  <div className='label-action' onClick={onDeleteCard(index)}><p>x</p></div>
                </div>
                <div className="status-wrepper">
                  <h3>{"hp"}</h3>
                  <div className="status">
                    <div className="color" style={{ width: statusHp(item.hp) + "%" }} />
                  </div>
                </div>
                <div className="status-wrepper">
                  <h3>{"str"}</h3>
                  <div className="status">
                    <div className="color" style={{ width: statusStk(item?.attacks?.length) + "%" }} />
                  </div>
                </div>
                <div className="status-wrepper">
                  <h3>{"weak"}</h3>
                  <div className="status">
                    <div className="color" style={{ width: statusWeak(item?.weaknesses?.length) + "%" }} />
                  </div>
                </div>
                <div className="status-happiness-wrepper">
                  {statusHappiness(item)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="button-add" onClick={onIsOpenModal(true)}>+</div>
      </div>
      <Modal dataDax={dataDax} data={data} setData={setData} isOpenModal={isOpenModal} onIsOpenModal={onIsOpenModal} onAddCard={onAddCard} />
    </div>
  );
}

const Modal = (props) => {
  const { dataDax, data, isOpenModal, onIsOpenModal, onAddCard } = props;
  const [search, setSearch] = useState("");

  const onInput = (e) => {
    setSearch(e.target.value);
  };

  const dataSearch = data.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase());
  })

  return (
    <div
      className="modal-wrapper"
      style={{ display: isOpenModal ? 'flex' : "none" }}
      onClick={onIsOpenModal(false)}>
      <div
        className="modal-body"
        onClick={e => { e.stopPropagation() }}>
        <input type="text" className="input-icons" value={search} placeholder="Find Pokémon" onChange={onInput} />
        <div className='modal-card-wrepper'>
          {dataSearch?.map((item, index) => {
            let disableCard = dataDax.find(o => o.id === item.id)
            return !disableCard && (
              <div key={index} className="card">
                <div >
                  <img src={item.imageUrl} alt={""} height={250}></img>
                  <div className="detail-wrepper">
                    <div className='action-wrepper'>
                      <p>{item.name}</p>
                      <div className='label-action' onClick={onAddCard(item)}><p>add</p></div>
                    </div>
                    <div className="status-wrepper">
                      <h3>{"hp"}</h3>
                      <div className="status">
                        <div className="color" style={{ width: statusHp(item.hp) + "%" }} />
                      </div>
                    </div>
                    <div className="status-wrepper">
                      <h3>{"str"}</h3>
                      <div className="status">
                        <div className="color" style={{ width: statusStk(item?.attacks?.length) + "%" }} />
                      </div>
                    </div>
                    <div className="status-wrepper">
                      <h3>{"weak"}</h3>
                      <div className="status">
                        <div className="color" style={{ width: statusWeak(item?.weaknesses?.length) + "%" }} />
                      </div>
                    </div>
                    <div className="status-happiness-wrepper">
                      {statusHappiness(item)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

const statusHp = (value) => {
  if (!isNaN(parseInt(value))) {
    return value > 100 ? 100 : value
  } else {
    return 0
  }
}

const statusStk = (value) => {
  if (value) {
    return value * 50;
  } else {
    return 0
  }
}

const statusWeak = (value) => {
  if (value) {
    return value * 100
  } else {
    return 0
  }
}
const statusDamage = (value) => {
  if (value) {
    let sum = 0;
    for (const obj of value) {
      sum = sum + parseInt(obj.damage !== "" ? obj.damage.replace(/[^0-9 ]/g, "") : 0);
      ;
    }
    return sum > 100 ? 100 : sum
  } else {
    return 0
  }
}

const statusHappiness = (value) => {
  let happiness = 0;
  let img = [];

  happiness = Math.round(((statusHp(value.hp) / 10) + (statusDamage(value?.attacks) / 10) + 10 - (value?.weaknesses?.length)) / 5);
  for (let i = 0; i < happiness; i++) {
    img.push(
      <img key={i} src={IcHappiness} alt={"happiness"} height={45}></img>
    );
  }
  return img;
}

export default App
