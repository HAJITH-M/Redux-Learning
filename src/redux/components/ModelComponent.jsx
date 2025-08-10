import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggle } from '../features/modelslice/modelSlice'

const ModelComponent = () => {

    const dispatch = useDispatch()
    const isOpen = useSelector(State => State.model.isOpen)


  return (
    <>
    <button onClick={() => dispatch(toggle())}>
    click me to open and close the model
    </button>

    {isOpen && <div className="modal">Modal Content Here</div>}

    </>
  )
}

export default ModelComponent