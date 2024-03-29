import React,{useState,useEffect} from 'react'
import { DonationList } from '../api/Collections'
import { useTracker } from 'meteor/react-meteor-data';
import {Alert,Modal,Spinner,Form,Row,Col,Button,Carousel,Accordion,OverlayTrigger,Popover,Stack} 
from 'react-bootstrap';
import {Files} from '../api/Collections';
import {GiConfirmed} from '@react-icons/all-files/gi/GiConfirmed';//to use icon
import {GiCancel} from '@react-icons/all-files/gi/GiCancel';
import {FaTrashAlt} from '@react-icons/all-files/fa/FaTrashAlt'

const AdminDonation = () => {
    if(Meteor.user()){
    if(Meteor.user().profile.role=='admin'){
    
    let verifyIcon = { color: "#26bd00"};//used to change color of icon
    let cancelIcon = { color: "#ff2222"};//used to change color of icon
    
    const [donation_id,setDonation_id]=useState('');
    const [status,handleStatus]=useState('');
    const [remark,handleRemark]=useState('');
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};
    
    const [donindex,setDonindex]=useState('');
    const [tableindex,setTableIndex]=useState('');
    const [brand,setBrand]=useState('');
    const [medtype,setMedType]=useState('');
    const [composition,setComposition]=useState('');
    const [reload,setReload]=useState(0);
    
    const [detailshow, setDetailShow] = useState(false);
    const handleDetailClose = () => setDetailShow(false);
    const handleDetailShow = () => {setDetailShow(true)};
    
    const [editmedshow, setEditMedShow] = useState(false);
    const handleEditMedClose = () => setEditMedShow(false);
    const handleEditMedShow = () => {setEditMedShow(true);}
    
    const [remarkshow,setRemarkShow]=useState(false);
    const handleRemarkClose = () => setRemarkShow(false);
    const handleRemarkShow = () => {setRemarkShow(true)};
    const isLoadingData = useTracker(()=>{
        const handle=Meteor.subscribe('donationAdmin');//used useTracker to continuously check if subscribe is ready 
        const handleusers=Meteor.subscribe('allUsers');
        console.log('isLoadingData')
        return(!handle.ready()&&!handleusers.ready());
        })

    // const isLoadingImg = useTracker(()=>{
    //     const handle=Meteor.subscribe('donationAdminImages');
    //     return(!handle.ready());
    //     })

    

    useEffect(() => {
        if(!isLoadingData){
        console.log(reload);
        const donname=DonationList.find({},{fields:{}}).fetch().reverse();
        
        for(i=0;i<donname.length;i++){
            if(donname[i].verify_status==true){
                document.getElementById(`row${i}`).className='verified'
            }else{
                document.getElementById(`row${i}`).className='not-verified'
            }
        }
    }
        }, [isLoadingData,reload]);
    
    var image;
    if(!isLoadingData){
        const donname=DonationList.find({},{fields:{}}).fetch().reverse();
        console.log(donname);
        function verify(id){  
            const user=Meteor.user();
            Meteor.call('adminVerify',id,Meteor.user().username,
            (error,result)=>{
                if(error){
                    alert('error status not updated');
                }else{
                    alert(`verify status changed to ${(DonationList.findOne({_id:id})).status}`);
                    var email=Meteor.users.findOne({username:(DonationList.findOne({_id:id})).username}).emails[0].address;
                    console.log(email);
                    var body=`<!DOCTYPE html>
                    <html lang="en">
                    <head> 
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    </head>
                    <body>
                        <h3>Status update of your donation:</h3>
                        <h3>Medicine Name: ${(DonationList.findOne({_id:id})).medicine_name}</h3>
                        <h3>Donation id: ${id}</h3>
                        <h3>status: ${(DonationList.findOne({_id:id})).status}</h3>
                    </body>
                </html>`
                    Meteor.call(
                        'sendEmail',
                        `${(DonationList.findOne({_id:id})).username} <${email}>`,
                        'admin@sharemeds.com',
                        'Medicine Donation status',
                        body
                    );
            
                    setReload(reload+1);
                }
            });
            console.log(id);
            
            console.log("update");
            // DonationList.update(donname[index]._id,{$set:{verified_by:user.username}});
            
        }
        function rejectVerification(id){
            const user=Meteor.user();
            Meteor.call('rejectVerification',id,Meteor.user().username,
            (error,result)=>{
                if(error){
                    alert('error status not updated');
                }else{
                    alert(`verify status changed to ${(DonationList.findOne({_id:id})).status}`);
                    
                    setReload(reload+1);
                }
                var email=Meteor.users.findOne({username:(DonationList.findOne({_id:id})).username}).emails[0].address;
                    console.log(email);
                    var body=`<!DOCTYPE html>
                    <html lang="en">
                    <head> 
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    </head>
                    <body>
                        <h3>Status update of your donation:</h3>
                        <h3>Medicine Name: ${(DonationList.findOne({_id:id})).medicine_name}</h3>
                        <h3>Donation id: ${id}</h3>
                        <h3 style="color:red">status: ${(DonationList.findOne({_id:id})).status}</h3>
                    </body>
                </html>`
                    Meteor.call(
                        'sendEmail',
                        `${(DonationList.findOne({_id:id})).username} <${email}>`,
                        'admin@sharemeds.com',
                        'Medicine Donation status',
                        body
                    );
                      
                    
            });
            // DonationList.update(id,{$set:{verify_status:'rejected'}});
            // DonationList.update(id,{$set:{status:'rejected'}});
            
        }
        function verifyColor(t){
            if(t==true){
                return "verified";
            }
            else{
                return "not-verified"
            }
        }

        setRemark=(id)=>{
            // DonationList.update(id,{$set:{remark:remark,edit:true}});
            Meteor.call('setRemark',id,remark,
            (error,result)=>{
                if(error){
                    alert(`Error remark not changed`);
                }else{
                    alert(`remark changed to ${(DonationList.findOne({_id:id})).remark}`);
                    setReload(reload+1);
                    handleRemarkClose();
                }
            })
        }

        deleteDonation=(id)=>{
            if(confirm('Are you sure you want to delete donation?')){
                Meteor.call('deleteDonation',id,
                (error,result)=>{
                    if(error){
                        alert('error deleting donation')
                    }else{
                        alert('deleted successfully');
                        setReload(reload+1);
                    }
                })
            }
        }

        setEditStatus=(id,status)=>{
            // DonationList.update(id,{$set:{edit:status}});
            Meteor.call('setEditStatus',id,status,
            (error,result)=>{
                if(error){
                    alert('error edit status not updated');
                }else{
                    alert(`edit status changed to ${(DonationList.findOne({_id:id})).edit}`);
                    setReload(reload+1);
                }
            })
            console.log(donname)
            
        }
        setMedDetail=()=>{
                if(medtype!=''&& brand!='' && composition!=''){
                //DonationList.update(donation_id,{$set:{type:medtype,brand:brand,composition:composition}});
                Meteor.call('setMedDetail',donation_id,medtype,brand,composition,
                (error,result)=>{
                    console.log('meteor.call')
                    if(error){
                        alert('error medicine details not updated');
                    }else{
                        alert(`Medicine details updated to ${(DonationList.findOne({_id:donation_id})).type}
${(DonationList.findOne({_id:donation_id})).brand}\n${(DonationList.findOne({_id:donation_id})).composition}`);
                        setReload(reload+1);
                    }
                }
            );
                console.log(donname)
                handleEditMedClose();

                }
                else{
                alert('One or More Fields are empty');
                }
        }
       
        const search=(field)=>{
            var fieldindex;
            switch(field){
                case 'medname':{
                    fieldindex=4;
                    break;
                }
                case 'donorname':{
                    fieldindex=3;
                    break;
                }
                case 'type':{
                    fieldindex=5;
                    break;
                }
    
            }
            let filter=document.getElementById(field).value.toUpperCase();
            let mytable=document.getElementById('table');
            let tr=mytable.getElementsByTagName('tr');
            for(var i=0;i<tr.length;i++)
            {let td=tr[i].getElementsByTagName('td')[fieldindex];
             if(td){
                    let textvalue=td.textContent || td.innerHTML;
                    console.log(textvalue)
                    if(textvalue.toUpperCase().indexOf(filter)>-1)
                        {tr[i].style.display="";
                        }
                        else
                        {tr[i].style.display="none";
                        }
                    }
            }
        }
    return (
        <div className='admin-page'>
          <Stack direction="horizontal" gap={5} className='search-row'>
              <div>
                <input type='text' id='medname' className='form-control form-control-sm' 
                placeholder='search medicine name..' onKeyUp={()=>{search('medname')}}/>
              </div>
              <div>
                <input type='text' id='donorname' className='form-control form-control-sm' 
                placeholder='search donor name..' onKeyUp={()=>{search('donorname')}}/>
              </div>
              <div>
              <Form.Select size="sm" id={`type`} onChange={()=>{search('type')}}>
                <option value=''>All</option>
                <option value='antipyretic'>antipyretic</option>
                <option value='antibiotic'>antibiotic</option>
                <option value='antiseptic'>antiseptic</option>
                <option value='analgesic'>analgesic</option>
                <option value='mood_stabilizer'>mood stabilizer</option>
                <option value='others'>others</option>
             </Form.Select>
            </div>
            <div className='ms-auto'>
                 <Button onClick={()=>{setReload(reload+1)}}>&#x21bb;</Button>
             </div>
            </Stack>
          <div className="table-scrollbar Flipped"> {/*used to flip the div to get horizontal scrollbar */}
          <div className='Flipped'> {/*used to flip back the table contents*/}
            <table className="admin-table" id='table'>
            <tr>    
                    <th width='50px'></th>
                    <th width='150px'></th>
                    <th width='120px'></th>
                    <th width='120px'>Donor Name</th>
                    {/* <th width="100px">Phone Number</th>
                    <th width="200px">Address</th> */}   
                    <th width='120px'>Medicine Name</th>
                    <th width='120px'>Medicine Type</th>
                    <th width='120px'>Medicine Brand</th>
                    <th width='120px'>Composition</th>
                    <th width='120px'>Expiry Date</th>
                    <th width='120px'>Status</th>
                </tr>
             <tbody>   
            {
            donname.map((donation,index) => (
                <tr data-index={index} id={`row${index}`} > 
                    <td>
                    <OverlayTrigger trigger="click" key={index} placement='right' rootClose={true} //rootClose to close popover when cllicked outside
                    overlay={
                    <Popover id={`popoveroptions${index}`}>
                        <Popover.Header as="div">   
                        <Row style={{'font-size':'12px'}}>
                            <Col width='150px'>Set Medicine detail</Col>
                            <Col width="210px">Set Edit</Col>
                            <Col width="130px">Verification Status</Col>
                            <Col width="100px">Verified by</Col>
                            <Col width="100px">Verify</Col>
                            <Col width="100px"></Col>
                            <Col width="150px">Remark</Col>
                            <Col width="50px"></Col> 
                        </Row>
                        </Popover.Header> 
                        <Popover.Body>
                          
                            <Row>               
                                <Col style={{'padding':'0px','margin':'auto'}} width='150px'>
                                        <Button onClick={()=>{setDonation_id(donation._id);setBrand(donation.brand);setComposition(donation.composition);setMedType(donation.type);handleEditMedShow();}}>Edit</Button>
                                </Col>
                                
                                <Col style={{'margin':'auto'}} width='210px'>{/*radio for edit status*/}
                                    <Row>
                                        <Col style={{'margin':'auto'}}>      
                                        <Form.Check 
                                        type="switch"
                                        id={`status${index}`}
                                        checked={donation.edit}
                                        label={(donation.edit)?('Edit Enabled'):('Disabled Edit')}
                                        />
                                            
                                        </Col>
                                        <Col style={{'margin':'auto'}}>
                                            <Button variant='warning' onClick={()=>{handleStatus(donation.edit);setEditStatus(donation._id,!donation.edit);console.log(donation.edit)}}>
                                                {(donation.edit)?('disable'):('enable')}</Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{'margin':'auto'}} width='130px'>
                                <span className={"status-"+(verifyColor(donation.verify_status))}>
                                {(donation.verify_status==true)?(<span style={verifyIcon}><GiConfirmed style={verifyIcon}/> Verified</span>)
                                :(donation.verify_status=="rejected")?(<span style={cancelIcon}><GiCancel style={cancelIcon}/> Rejected</span>)
                                :("Not Verified")}
                                </span>
                                </Col>
                                <Col style={{'margin':'auto'}} width='100px'>{donation.verified_by}</Col>
                                <Col style={{'margin':'auto'}} width='100px'>
                                    <button id={index} className={(verifyColor(!donation.verify_status))} onClick={()=>{verify(donation._id)}}>
                                        {(donation.verify_status==true)?("Cancel")
                                        :(donation.verify_status=="rejected")?("Cancel Rejection")
                                        :("Verify")}</button>
                                </Col> 
                                <Col style={{'margin':'auto'}} width='100px'>   
                                    <button style={{"color":"red"}} onClick={()=>rejectVerification(donation._id)}>Reject</button>
                                </Col> 
                                <Col style={{'margin':'auto'}} width='150px'>
                                    {(donation.remark)?(donation.remark):('no remarks yet')}<br/>
                                    <Button className='btn-danger' onClick={()=>{setDonation_id(donation._id);handleRemark(donation.remark);handleRemarkShow()}}>Remark</Button>
                                </Col>
                                <Col style={{'margin':'auto'}}>
                                    <Button variant='danger' onClick={()=>{deleteDonation(donation._id)}}>
                                    <FaTrashAlt/>
                                    </Button>
                                </Col>
                                
                            </Row>
                            
                         </Popover.Body>
                    </Popover>   
                    }>
                        <Button  >&#9881;</Button>
                    </OverlayTrigger>

                    </td> 
                     <td className="image-table" width='120px' >
                     {(donation.images.length == 1)?
                        ((image=donation.images)?
                        (<img className='preview-image' loading='lazy' src={URL.createObjectURL(new Blob([image[0]]))}
                        onClick={()=>{setDonation_id(donation._id);handleShow()}}/>)
                        :"Not found")
                        :(<Carousel variant="dark">
                                    {(image=donation.images)?
                                    ( image.map((img,index) => (
                                    <Carousel.Item>
                                    <img className='preview-image' loading='lazy' src={URL.createObjectURL(new Blob([img]))}
                                    onClick={()=>{setDonation_id(donation._id);{console.log(donation_id)};handleShow()}}/>
                                    </Carousel.Item>))):"Not found"
                                    }
                            </Carousel>)}
                    </td>
                    {/* {console.log(index)} */}
                    <td width='120px'>
                    <OverlayTrigger trigger="click" key={index} placement='right' 
                    overlay={
                                <Popover id={`popoverdetail${index}`}>
                                <Popover.Header as="h3">Donation Details</Popover.Header>
                                <Popover.Body>
                                <table>
                    <tr>
                        <td align='right'>_id:</td>
                        <td>{donation._id}</td>
                    </tr>
                    <tr>
                        <td align='right'>user_id:</td>
                        <td>{(donation.user_id)?(donation.user_id):('not found')}</td>
                    </tr>
                    <tr>
                        <td align='right'>donatdeat:</td>
                        <td>{donation.donatedat}</td>
                    </tr>
                    <tr>
                        <td align='right'>username:</td>
                        <td>{donation.username}</td>
                    </tr>
                    <tr>
                        <td align='right'>donor_name:</td>
                        <td>{donation.donor_name}</td>
                    </tr>
                    <tr>
                        <td align='right'>medicine_name:</td>
                        <td>{donation.medicine_name}</td>
                    </tr>
                    <tr>
                        <td align='right'>phone:</td>
                        <td>{donation.phone}</td>
                    </tr>
                    <tr>
                        <td align='right'>address:</td>
                        <td>{donation.address}</td>
                    </tr>
                    <tr>
                        <td align='right'>brand:</td>
                        <td>{donation.brand}</td>
                    </tr>
                    <tr>
                        <td align='right'>composition:</td>
                        <td>{donation.composition}</td>
                    </tr>
                    <tr>
                        <td align='right'>exp_date:</td>
                        <td>{donation.exp_date}</td>
                    </tr>
                    <tr>
                        <td align='right'>verify_status:</td>
                        <td>{(donation.verify_status)?('true'):('false')}</td>
                    </tr>
                    <tr>
                        <td align='right'>status:</td>
                        <td>{donation.status}</td>
                    </tr>
                    <tr>
                        <td align='right'>verified_by:</td>
                        <td>{donation.verified_by}</td>
                    </tr>
                    </table>
                                </Popover.Body>
                                </Popover>
                            }
                            >
                        <Button variant='info'>detail</Button>
                        </OverlayTrigger>
                    </td>
                    <td width='120px'>
                    <OverlayTrigger key={index} placement='top' 
                    overlay={
                                <Popover id={`popover${index}`}>
                                <Popover.Header as="h3">User Details</Popover.Header>
                                <Popover.Body>
                                    <Row style={{'color':'red'}}>
                                        <Col>Phone Number:</Col><Col>{donation.phone}</Col>
                                    </Row>
                                    <Row style={{'color':'blue'}}>    
                                        <Col>Address:</Col><Col >{donation.address}</Col>
                                    </Row>       
                                </Popover.Body>
                                </Popover>
                            }
                            >       
                        <span>{donation.donor_name}</span>    
                    </OverlayTrigger>
                    </td >
                    {/* <td width='120px'>{name.phone}</td>
                    <td width='200px'>{name.address}</td> */}
                    {/* {console.log(name.donor_name)} */}
                    <td width='120px'>{donation.medicine_name}</td>
                    <td width='120px'>{donation.type}</td>
                    <td width='120px'>{donation.brand}</td>
                    <td width='120px'>{donation.composition}</td>
                    <td width='120px'>{donation.exp_date}</td>
                    <td width='120px'>{donation.status}</td>
        
                    
                 </tr>   
                
            )
         
        )
       
    }       </tbody>
            </table>
            </div>
           </div> 
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                {donation_id?(<Carousel variant="dark">
                            {(image=(DonationList.findOne({_id:donation_id})).data)?
                            ( image.map((img,index) => (
                            <Carousel.Item>
                            <img className='admin-image' loading='lazy' src={URL.createObjectURL(new Blob([img]))}
                            />
                            </Carousel.Item>))):"Not found"
                            }
                    </Carousel> ):null}
                </Modal.Body>
              </Modal>
              <Modal show={detailshow} onHide={handleDetailClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                {(donindex)?    
                (<table>
                    <tr>
                        <td align='right'>_id:</td>
                        <td>{donindex}</td>
                    </tr>
                    <tr>
                        <td align='right'>user_id:</td>
                        <td>{((DonationList.findOne({_id:donindex})).user_id)?((DonationList.findOne({_id:donindex})).user_id):('not found')}</td>
                    </tr>
                    <tr>
                        <td align='right'>donatdeat:</td>
                        <td>{(DonationList.findOne({_id:donindex})).donatedat}</td>
                    </tr>
                    <tr>
                        <td align='right'>username:</td>
                        <td>{(DonationList.findOne({_id:donindex})).username}</td>
                    </tr>
                    <tr>
                        <td align='right'>donor_name:</td>
                        <td>{(DonationList.findOne({_id:donindex})).donor_name}</td>
                    </tr>
                    <tr>
                        <td align='right'>medicine_name:</td>
                        <td>{(DonationList.findOne({_id:donindex})).medicine_name}</td>
                    </tr>
                    <tr>
                        <td align='right'>phone:</td>
                        <td>{(DonationList.findOne({_id:donindex})).phone}</td>
                    </tr>
                    <tr>
                        <td align='right'>address:</td>
                        <td>{(DonationList.findOne({_id:donindex})).address}</td>
                    </tr>
                    <tr>
                        <td align='right'>brand:</td>
                        <td>{(DonationList.findOne({_id:donindex})).brand}</td>
                    </tr>
                    <tr>
                        <td align='right'>composition:</td>
                        <td>{(DonationList.findOne({_id:donindex})).composition}</td>
                    </tr>
                    <tr>
                        <td align='right'>exp_date:</td>
                        <td>{(DonationList.findOne({_id:donindex})).exp_date}</td>
                    </tr>
                    <tr>
                        <td align='right'>verify_status:</td>
                        <td>{((DonationList.findOne({_id:donindex})).verify_status)?('true'):('false')}</td>
                    </tr>
                    <tr>
                        <td align='right'>status:</td>
                        <td>{(DonationList.findOne({_id:donindex})).status}</td>
                    </tr>
                    <tr>
                        <td align='right'>verified_by:</td>
                        <td>{(DonationList.findOne({_id:donindex})).verified_by}</td>
                    </tr>
                </table>):(null)
    }
        </Modal.Body>
              </Modal>
                <Modal show={remarkshow} onHide={handleRemarkClose}>
                    <Modal.Header closeButton>  
                        Set Remark
                    </Modal.Header>
                    <Modal.Body>
                        <input type='text' onChange={e=>handleRemark(e.target.value)} value={remark} className='form-control'/>
                        <br/>
                        <Button className='btn-primary' onClick={()=>{setRemark(donation_id);console.log('click')}}>submit</Button>
                    </Modal.Body>
              </Modal>

              <Modal show={editmedshow} onHide={handleEditMedClose}>
                    <Modal.Header closeButton>  
                        Set Medicine Details
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                            <div className='col-4 p-1'>
                                Medicine type:
                            </div>
                            <div className='col-8 p-1'>
                                        <Form.Select size="sm" id={`type${tableindex}`} value={medtype} 
                                        onChange={e=>setMedType(e.target.value)} style={{marginLeft:'-8px',width:'95%'}}>
                                            <option>select medicine type</option>
                                            <option value='antipyretic'>antipyretic</option>
                                            <option value='antibiotic'>antibiotic</option>
                                            <option value='antiseptic'>antiseptic</option>
                                            <option value='analgesic'>analgesic</option>
                                            <option value='mood_stabilizer'>mood stabilizer</option>
                                            <option value='others'>others</option>
                                        </Form.Select>
                                    </div>
                                <div className='row'> 
                                    <div className='col-4 p-1'>
                                       brand:
                                    </div>   
                                       <div className='col-8 p-1'>
                                           <input className='form-control form-control-sm' value={brand} onChange={e=>setBrand(e.target.value)}
                                        type='text'/>
                                        </div>
                                    </div>
                                <div className='row'> 
                                    <div className='col-4 p-1'>
                                        composition:
                                    </div>
                                     <div className='col-8 p-1'>
                                            <input className='form-control form-control-sm' value={composition} onChange={e=>setComposition(e.target.value)} 
                                            type='text'/>
                                        </div>
                                    <div className='p-1'>
                                <Button variant='warning' style={{'width':'100%'}} onClick={setMedDetail}>set</Button>
                            </div>
                                </div>
                        </div>
                    </Modal.Body>
              </Modal>
        </div>
        )
        }//if isLoading
        else{
            return(<div>
                <Spinner className="spinner" animation="grow" variant="primary" 
               />
            </div>)  
        }
    }//if admin 
    else{
        return(<div>you do not have permission to access this page</div>)
    }
}//is user
else if(Meteor.loggingIn()){
    return(<div>
        <Spinner className="spinner" animation="border" variant="primary" 
       />
    </div>)         
  }
  else{
    return(<Alert variant='warning'>You need to be logged in to continue</Alert>);
  }
}
export default AdminDonation
