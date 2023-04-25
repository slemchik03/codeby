import Dashboard from './icons/Dashboard.svg'
import News from './icons/News.svg'
import Category from './icons/Category.svg'
import User from './icons/User.svg'
import Settings from './icons/Settings.svg'
import Logout from './icons/Logout.svg'
import Admin from './icons/admin.svg'
import Team from './icons/Team.svg'

export const routes = [
  {
    path: '/',
    name: 'Скорборд',
    icon: <Dashboard />,
  },
  {
    path: '/news',
    name: 'Новости',
    icon: <News />,
  },
  {
    path: '/categories',
    name: 'Категории',
    icon: <Category />,
  },
  {
    path: '/profile',
    name: 'Профиль',
    icon: <User />,
  },
  {
    path: '/team',
    name: 'Команда',
    icon: <Team />,
  },
  {
    path: '/admin',
    name: (
      <>
        <span>Панель {<br />}</span>
        <span>администратора</span>
      </>
    ),
    icon: <Admin />,
  },
  {
    path: '/settings',
    name: 'Настройки',
    icon: <Settings />,
  },

]
