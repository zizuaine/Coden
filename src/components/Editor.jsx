import { useEffect, useRef } from "react"
import Codemirror from "codemirror"
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import Actions from "../../Actions"

const Editor = ({ socket, socketRef, roomId, onCodeChange }) => {

    const editorRef = useRef(null);

    useEffect(() => {
        editorRef.current = Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
            mode: { name: "javascript", json: true },
            theme: 'dracula',
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true
        });


        editorRef.current.on("change", (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);

            if (origin !== "setValue" && socketRef.current) {
                socketRef.current.emit(Actions.CODE_CHANGE, {
                    roomId,
                    code,

                });
            }
        })

    }, []);

    useEffect(() => {

        if (!socket) return;

        const handleCodeChange = ({ code }) => {
            if (code !== null) {
                editorRef.current.setValue(code);
            }
        };

        socket.on(Actions.CODE_CHANGE, handleCodeChange);

        return () => {
            socket.off(Actions.CODE_CHANGE, handleCodeChange);
        };

    }, [socket]);

    return (
        <textarea id="realtimeEditor"></textarea>
    )
}

export default Editor