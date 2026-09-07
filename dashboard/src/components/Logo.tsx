import { Link } from 'react-router-dom'

const Logo = () => {
    return (
        <Link to='/'>
            <img src='/logo.jpg' alt='Logo' className='h-10 rounded-xl' />
        </Link>
    )
}

export default Logo