import React, { Component } from 'react'

import { message, Modal, Upload, Icon } from 'antd'
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../config/constant';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {

    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: []
    }

    constructor(props) {
        super(props)

        if (props.imgs && props.imgs.length > 0) {
            const fileList = props.imgs.map((imgName, index) => {
                return {
                    uid: -index, //如果是用户自己创建的，uid就是一个负值，避免与系统创建的冲突
                    name: imgName,
                    url: BASE_IMG_URL + imgName,
                    status: 'done'
                }
            })
            this.state.fileList = fileList
        }
    }

    handleCancel = () => {
        this.setState({ previewVisible: false })
    }

    handlePreview = async (file) => {
        if (!file.url && !file.thumbnail) {
            file.thumbnail = await getBase64(file.originFileObj)
        }
        this.setState({
            previewVisible: true,
            previewImage: file.url || file.thumbnail,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        })
    }

    handleChange = async ({ file, fileList }) => {
        if (file.status === 'done') { //fileList包含所有已上传的files，包括刚刚上传好的文件file，但是要注意的是file和fileList中最后上传的文件不是同一个对象，虽然他们的name和url都一样
            const file2 = fileList.find(f => f.name === file.name && f.url === file.url)
            if (file2) {
                if (file.response.status === 0) {
                    const { name, url } = file.response.data
                    file2.name = name
                    file2.url = url
                }
            }
        }
        else if (file.status === 'removed') { //当前端删除了某个文件后，其会从fileList中移除，即使此时还没有请求后端删除
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }

        this.setState({fileList})
    }

    getImgs() {
        const { fileList } = this.state
        if (fileList && fileList.length > 0)
            return fileList.map(f => f.name)
        else
            return []
    }

    render() {
        const { previewVisible, previewTitle, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className='ant-upload-text'>Upload</div>
            </div>
        )
        return (
            <div>
                <Upload fileList={fileList} //已经上传的在前端的文件列表，如果移除图片，则在请求服务器删除前fileList就会先移除此文件
                    accept='images/*'
                    action='/manage/img/upload'
                    name='image' //上传文件时请求的参数，用于提交文件
                    listType='picture-card'
                    onPreview={this.handlePreview} //当点击某个缩略图弹出预览框
                    onChange={this.handleChange}>
                    {
                        fileList.length >= 5 ? null : uploadButton
                    }
                </Upload>
                <Modal visible={previewVisible} footer={null} title={previewTitle}
                    onCancel={this.handleCancel}>
                    <img src={previewImage} alt='img' />
                </Modal>
            </div>
        )
    }
}
