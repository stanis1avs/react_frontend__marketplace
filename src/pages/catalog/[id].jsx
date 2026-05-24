import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from "react-redux";
import { fetchCatalogId } from "@/Actions/ActionCatalogId";
import { cartAdd } from "@/Reducers/ReducerCart";
import { addToDbCart } from "@/Actions/ActionCart";
import Loader from "@/pages/Loader";

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export async function getServerSideProps({ params }) {
  const { id } = params;
  return {
    props: { id },
  };
}

export default function CatalogId({ id }) {
  const dispatch = useDispatch();
  const router = useRouter()
  const { item, loading, error, countSizes } = useSelector(state => state.ReducerCatalogId)
  const token = useSelector((state) => state.ReducerAuth?.token)

  const [size, setSize] = useState(null);
  const [count, setCount] = useState(0);

  const handlerClickSize = ({ target }) => {
    setSize(Number(target.dataset.id))
  }

  const handlerClickCount = (x) => {
    let sizeCopy = count + x;
    if (sizeCopy > 10) sizeCopy = 10;
    if (sizeCopy < 0) sizeCopy = 0;
    setCount(sizeCopy)
  }

  const handlerClickCart = () => {
    const selectedSize = item.sizes[size].size;
    const toCard = {
      id: item.id,
      title: item.title,
      size: selectedSize,
      count: count,
      price: item.price,
      result: count * item.price
    }
    // Always update local Redux cart
    dispatch(cartAdd(toCard))
    // If logged in, sync to DB cart (creates UserInteraction automatically)
    if (token) {
      dispatch(addToDbCart({ productId: item.id, size: selectedSize, count }))
    }
    router.push('/cart')
  }

  useEffect(() => {
    dispatch(fetchCatalogId(id))
    // Log view interaction if authenticated
    if (token) {
      fetch(`${API}/api/interactions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: Number(id), event_type: 'view' }),
      }).catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  return (
    <>
      {item &&
      <section className="catalog-item">
        <h2 className="text-center">{item.title}</h2>
        <div className="row">
          <div className="col-5">
            {item.images && <img src={item.images[0]} className="img-fluid" alt={item.title}/>}
          </div>
          <div className="col-7">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Артикул</td>
                  <td>{item.sku}</td>
                </tr>
                <tr>
                  <td>Производитель</td>
                  <td>{item.manufacturer}</td>
                </tr>
                <tr>
                  <td>Цвет</td>
                  <td>{item.color}</td>
                </tr>
                <tr>
                  <td>Материалы</td>
                  <td>{item.material}</td>
                </tr>
                <tr>
                  <td>Сезон</td>
                  <td>{item.season}</td>
                </tr>
                <tr>
                  <td>Повод</td>
                  <td>{item.reason}</td>
                </tr>
              </tbody>
            </table>
          <div className="text-center">
            {(countSizes > 0) ? <p>Размеры в наличии: {item.sizes.map((e, index) => e.available ? <span className={size === index ? "catalog-item-size selected" : "catalog-item-size"} key={index} data-id={index} onClick={handlerClickSize}>{e.size}</span> : '')}</p> : <p>Нет в наличии</p>}
            {(countSizes > 0) && <p>Количество: <span className="btn-group btn-group-sm pl-2">
              <button className="btn btn-secondary" onClick={() => handlerClickCount(-1)}>-</button>
              <span className="btn btn-outline-primary">{count}</span>
              <button className="btn btn-secondary" onClick={() => handlerClickCount(1)}>+</button></span></p>}
          </div>
            {(countSizes > 0) && <button className="btn btn-danger btn-block btn-lg" disabled={(count > 0) && (size !== null) ? false : true} onClick={handlerClickCart}>В корзину</button>}
        </div>
      </div>
    </section> }
      {loading && <Loader />}
      {error && <h2 className="text-center">{error}</h2>}
    </>
  )
}
