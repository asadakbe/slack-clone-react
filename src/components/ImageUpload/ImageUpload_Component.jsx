import React, {useState} from 'react';
import {Button, Input, Modal, Icon} from 'semantic-ui-react';
import mime from 'mime-types'

const ImageUpload = (props) => {
    const [fileState, setFileState] = useState(null);

    const acceptedTypes = ["image/png", "image/jpeg"]

    const onFileAdded = (e) => {
        const file = e.target.files[0];
        if(file) {
            setFileState(file);
        }
    }

    const onSubmit = () => {
        if(fileState && acceptedTypes.includes(mime.lookup(fileState.name))) {
            props.uploadImage(fileState, mime.lookup(fileState.name));
            props.onClose();
            setFileState(null);
        }
    }

    return (
        <Modal basic open={props.open} onClose={props.onClose}>
            <Modal.Header>Select a large</Modal.Header>
            <Modal.Content>
                <Input 
                    type="file"
                    name="file"
                    fluid
                    onChange={onFileAdded}
                    label="File Type (png, jpeg)"
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={onSubmit}>
                    <Icon name="checkmark" />Add
                </Button>

                <Button color="red" onClick={props.onClose}>
                    <Icon name="remove" />Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    )
} 

export default ImageUpload;