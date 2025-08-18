import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'

const Chat1 = () => {
  return (
    <div className='grid grid-cols-3'>
      <div className='col-span-1'><Sidebar /></div>
      <div className="col-span-2"><ChatWindow /></div>
    </div>
  )
}

export default Chat1
