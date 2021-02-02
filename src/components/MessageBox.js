export default function MessageBox(props){
    return(
        <div className = {`alert alert-${props.variant || 'info'} message-box`}>
            {props.children}
        </div>
    );
}