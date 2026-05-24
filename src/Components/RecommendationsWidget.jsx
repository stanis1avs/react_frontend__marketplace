import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendations } from '@/Actions/ActionRecommendations';
import Product from '@/Components/Product';
import Loader from '@/pages/Loader';

export default function RecommendationsWidget({ productId }) {
  const { items, loading, error } = useSelector((state) => state.ReducerRecommendations);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRecommendations(productId ? { productId } : {}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, productId]);

  if (error || (!loading && items.length === 0)) return null;

  return (
    <>
      <section className="top-sales">
        <h2 className="text-center">Вам может понравиться</h2>
        <div className="row">
          {items.slice(0, 6).map((el) => (
            <div className="col-4" key={el.id}>
              <div className="card">
                <Product product={el} />
              </div>
            </div>
          ))}
        </div>
      </section>
      {loading && <Loader />}
    </>
  );
}
