import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { onChangeCatalogSearch } from '../Reducers/ReducerCatalogSearch';
import CartIcon from "./Header/CartIcon"
import Logo from "./Header/Logo"
import Navigation from "./Header/Navigation"
import SearchButton from "./Header/SearchButton"
import SearchForm from "./Header/SearchForm"

export default function Header() {
  const searchFormRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSearch = () => {
    const searchFormEl = searchFormRef.current;
    const input = inputRef.current;
    if (!searchFormEl.classList.contains('invisible') && input.value !== '') {
      dispatch(onChangeCatalogSearch(input.value));
      router.push('/catalog');
    }
    searchFormEl.classList.toggle('invisible');
    input.focus();
  };

	return (
		<header className="container">
			<div className="row">
				<div className="col">
					<nav className="navbar navbar-expand-sm navbar-light bg-light">
						<Logo />
			      <div className="collapase navbar-collapse" id="navbarMain">
			      	<Navigation/>
	          	<div>
	          		<div className="header-controls-pics">
	                <SearchButton onSearch={handleSearch} />
	                <CartIcon/>
	              </div>
	               <SearchForm formRef={searchFormRef} inputRef={inputRef} onSearch={handleSearch} />
	            </div>
	          </div>
					</nav>
				</div>
			</div>
		</header>
	)
}