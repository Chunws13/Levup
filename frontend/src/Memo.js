import {useStat} from 'react'
function Memo() {
    const SubmitMemo = (event) => {
        event.preventDefault();
        const memoContent = event.target.memo.value;
        
    }

    return (
        <div>
            <form onSubmit={SubmitMemo}> 
                <input type='text' name='memo' placeholder=''/>
                <button type='submit'> submit</button>
            </form>
        </div>
    )
}

export default Memo;