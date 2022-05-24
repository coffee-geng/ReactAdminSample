import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextBox extends Component {
    static propType = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        let b = false
        if (props.detail) {
            const contentBlock = htmlToDraft(props.detail)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = { editorState }
                b = true
            }
        }
        if (!b) {
            this.state = { editorState: EditorState.createEmpty() }
        }
    }

    uploadImageCallback = (file)=>{
        return new Promise((resolve, reject)=>{
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/manage/img/upload')
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', ()=>{
                const response = JSON.parse(xhr.responseText)
                const url = response.data.url
                resolve({data: {link:url}})
            })
            xhr.addEventListener('error', ()=>{
                const error = JSON.parse(xhr.responseText)
                reject(error)
            })
        })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        })
    }

    getHtmlDoc = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state
        return (
            <Editor editorState={editorState}
                editorClassName='richtextbox-editor'
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: {
                        alt: { present: false, mandatory: false },
                        defaultSize: {
                            height: 'auto',
                            width: 'auto',
                        },
                        uploadCallback: this.uploadImageCallback,
                    }
                }}
            ></Editor>
        )
    }
}
