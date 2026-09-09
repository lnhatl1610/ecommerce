import { Link } from 'react-router-dom'

const Logo = () => {
    return (
        <Link to='/'>
            <img src='/logo.jpg' alt='Logo' className='h-8 w-auto rounded-lg object-contain' />
        </Link>
    )
}

export default Logo
