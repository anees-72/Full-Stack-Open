import {setFilter} from '../reducers/filterReducer'
import {useDispatch} from 'react-redux'



const Filter = () => {
    const dispatch = useDispatch()
    const handleFilterChange = (event) => {
        event.preventDefault()
        dispatch(setFilter(event.target.value))
    }
    const style = {
        marginBottom: 10
    }
    return (
        <div style = {style}>
           Filter: <input onChange={handleFilterChange} name="filter" />
        </div>
    )
}

export default Filter