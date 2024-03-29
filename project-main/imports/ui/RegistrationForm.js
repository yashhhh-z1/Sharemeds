import React, { useState } from 'react';
import {Form, FloatingLabel,Button,Alert,Modal,Stack} from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
//import { DonationList } from '../api/links';
import {useNavigate} from 'react-router-dom';


const RegistrationForm = ()=>{
    const [name,handleNameChange]=useState('');
    const [username,handleUsernameChange]=useState('');
    const [email,handleEmailChange]=useState('');
    const [password,handlePasswordChange]=useState('');
    const [phone,handlePhoneChange]=useState('')
    const [confpassword,handleConfPasswordChange]=useState('');
    const [usernameError,handleUsernameError]=useState('');
    const [passwordError,handlePasswordError]=useState('');
    const [address,handleAddressChange]=useState('');

    const [modalmessage,handleModalMessage]=useState('');
    const [showsubmit, setShowSubmit] = useState(false);
    const handleSubmitClose = () => setShowSubmit(false);
    const handleSubmitShow = () => {setShowSubmit(true)};
    const navigate=useNavigate();

    handleSubmit=(event)=>{
        event.preventDefault(); 
        handleSubmitShow();
       if(password == confpassword){   
           handlePasswordError('');
           handleModalMessage('uploading details....')
            Meteor.call('Account.create',username,password,email,name,address,phone,
            (error,result)=>{
                if(error){
                    console.log(error.reason);
                    handleModalMessage(error.reason)
                    document.querySelector("#modalokayerror").style.display = "inline";
                    handleUsernameError(`*${error.reason}`);
                    
                }else{
                    handleModalMessage('Registered Successfully')
                    document.querySelector("#modalokay").style.display = "inline";
                    document.querySelector("#modalokayerror").style.display = "none";
                    //alert(`Name:${name}\n Username: ${username}\n password:${password}phone:${phone} \n email:${email}\n address:${address}`)
                }
            })   
         }
        else{
            // while(true){
            //     if(showsubmit){
            //         console.log('inside while');
            //         
                    
            //         document.querySelector("#modalokayerror").style.display = "inline";
            //         break;
            //     }
            // }
            //document.querySelector("#modalokayerror").style.display = "inline";
            
           handleModalMessage('Passwords do not match');
           document.querySelector('#password').value='';
           document.querySelector('#confpassword').value='';

            handlePasswordError('*Passwords do not match');
        }
        
    }
        if(!Meteor.user()){
            return (
                <div className="form"> 
                <Form onSubmit={handleSubmit}>
                        <Form.Label className="form-label"><h1>Registration Form</h1></Form.Label> <br/>         
                        <Alert variant='warning'>You need to register inorder to donate or request medicine</Alert>          
                        <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                                <input type='text' className="form-control" onChange={e=>handleNameChange(e.target.value)}
                                placeholder="Name"
                                />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                                <input type='email' className="form-control" onChange={e=>handleEmailChange(e.target.value)}
                                placeholder="Email"
                                /> 
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                                <input type='text' pattern='^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$' className="form-control" onChange={e=>handleUsernameChange(e.target.value)}
                                placeholder="Username"
                                /> 
                        </FloatingLabel>
                        <Form.Text muted>
                            Username must consists of 5-20 alphanumeric characters<br/>
                        </Form.Text>
                        
                        <FloatingLabel controlId="floatingInput" label="Password" className="mb-3">
                            <input type='password' id='password' className='form-control' onChange={e=>handlePasswordChange(e.target.value)} 
                            placeholder='Password'
                            />
                            
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput"  label="Confirm Password" className="mb-3">
                            <input type='password' id='confpassword' className='form-control' onChange={e=>handleConfPasswordChange(e.target.value)} 
                            placeholder='Confirm Password'
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="Phone Number" className="mb-3">
                                <input type='tel' pattern='[0-9]{10}' value={phone} className="form-control" required onChange={e=>handlePhoneChange(e.target.value)}
                                placeholder="Phone Number"
                                />        
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingTextarea" label="Address" className="mb-3">
                            <Form.Control as="textarea" className="form-control" onChange={e=>handleAddressChange(e.target.value)}
                            placeholder="Enter address" />
                       </FloatingLabel>
                       <Form.Label className="loginError">{usernameError}</Form.Label>
                        <Form.Label className="loginError">{passwordError}</Form.Label><br/>
                        <Button variant="primary" type="submit">Submit</Button>                  
                    <Modal show={showsubmit} onHide={handleSubmitClose} backdrop="static" centered keyboard={false}>
                    <Modal.Header>  
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{'textAlign':'center'}}>{modalmessage}</p>
                        <Stack direction="horizontal" className='justify-content-center' gap={5}>
                        <Button id='modalokay' style={{'display':'none'}}
                        onClick={()=>{Meteor.loginWithPassword(username,password);navigate('/')}}
                        >Okay</Button>

                        {(passwordError)?(<Button variant='danger' id='modalokayerror' 
                            onClick={()=>{handleSubmitClose()}}
                            >Okay</Button>)
                            :(<Button variant='danger' id='modalokayerror' style={{"display":"none"}}
                            onClick={()=>{handleSubmitClose()}}
                            >Okay</Button>)}
                    </Stack>    
                    </Modal.Body>
              </Modal>  
                </Form>
                </div>
            )
    }
    else{
        return(
            <div>
                <Alert variant="success">You are already registered.
                <Alert.Link href="/">Click here</Alert.Link> to go to home page</Alert>
            </div>
        )
    }
}

export default RegistrationForm
