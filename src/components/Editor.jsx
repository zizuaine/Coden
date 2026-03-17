import { useEffect, useRef } from "react"
import Codemirror from "codemirror"
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import Actions from "../../Actions"

const Editor = ({ socketRef, roomId }) => {

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

            if (origin !== "setValue") {
                socketRef.current.emit(Actions.CODE_CHANGE, {
                    roomId,
                    code,

                });
            }
        })

    }, []);

    useEffect(() => {
        if (!socketRef.current) {
            return;
        }

        const handleCodeChange = ({ code }) => {
            if (code !== null) {
                editorRef.current.setValue(code);
            }
        }
        socketRef.current.on(Actions.CODE_CHANGE, handleCodeChange)

        return () => {
            socketRef.current?.off(Actions.CODE_CHANGE, handleCodeChange);
        }
    }, [socketRef.current])

    return (
        <textarea id="realtimeEditor"></textarea>
    )
}

export default Editor