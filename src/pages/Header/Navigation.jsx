import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/Actions/ActionAuth'

export default function Navigation() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state) => state.ReducerAuth?.user)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/')
  }

  return (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link className={pathname === '/' ? 'nav-link active' : 'nav-link'} href="/">Главная</Link>
      </li>
      <li className="nav-item">
        <Link className={pathname === '/catalog' ? 'nav-link active' : 'nav-link'} href="/catalog">Каталог</Link>
      </li>
      <li className="nav-item">
        <Link className={pathname === '/about' ? 'nav-link active' : 'nav-link'} href="/about">О магазине</Link>
      </li>
      <li className="nav-item">
        <Link className={pathname === '/contacts' ? 'nav-link active' : 'nav-link'} href="/contacts">Контакты</Link>
      </li>
      {user ? (
        <li className="nav-item d-flex align-items-center ml-2">
          <span className="nav-link text-muted" style={{ cursor: 'default' }}>{user.username}</span>
          <button className="btn btn-sm btn-outline-secondary ml-1" onClick={handleLogout}>
            Выйти
          </button>
        </li>
      ) : (
        <li className="nav-item">
          <Link className={pathname === '/login' ? 'nav-link active' : 'nav-link'} href="/login">Войти</Link>
        </li>
      )}
    </ul>
  )
}
