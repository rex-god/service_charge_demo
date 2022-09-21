/* eslint-disable jsx-a11y/alt-text */
import { SetStateAction, useState } from 'react';
import { Container, Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import axios from 'axios';
import file1 from 'public/logo512.png';
import { useWallet } from '@solana/wallet-adapter-react';
import { confirmTransactionFromFrontend } from '../utils/utility';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import LoaderComponent from './loader';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const CreateNftComponent = () => {
  const { publicKey, wallet, signTransaction } = useWallet();

  const [attribs, setAttribs] = useState([new Attribute('', '')]);
  const [dispFile, setDispFile]: SetStateAction<any> = useState(file1);
  const removeField = (index: number) => {
    const list = [...attribs];
    console.log();

    console.log('list', list);

    list.splice(index, 1);
    setAttribs(list);
  };
  const [symbol, setSymbol] = useState('');
  const [isCompletedTx, completeTx] = useState(true);

  const uppercaseSymbol = (event: { target: { value: string } }) => {
    const result = event.target.value.toUpperCase();
    setSymbol(result);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const formSubmission = async (data: any) => {
    try {
      completeTx(false);
      const { network } = data;
      const formData = { ...data, wallet: publicKey?.toBase58(), file: data.file[0] };
      if (data.donate) {
        formData.service_charge = JSON.stringify({ receiver: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc', amount: 0.01 });
      }
      delete formData.donate;
      
      const response = await axios({
        method: 'post',
        url: `${endpoint}/nft/create_detach`,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-api-key': apiKey as string,
        },
        data: formData,
      });
      const encodedTx: string = response?.data?.result.encoded_transaction;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      if (wallet !== null && typeof signTransaction !== 'undefined') {
        const shyftWallet = {
          wallet,
          signTransaction,
        }
        const completedTransaction = await confirmTransactionFromFrontend(connection, encodedTx, shyftWallet);
        console.log(completedTransaction);
        
      } else {
        throw new Error('Some error occured')
      }
      completeTx(true);
      toast.success("Your NFT created!! 🎉")
      return encodedTx;
    } catch (err) {
      completeTx(true);
      toast.error("Something is wrong!")
      console.error(err);
    }
  };
  return (
    <><><Container fluid>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(formSubmission)}>
            <Form.Group className="col-md-8 mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Network</Form.Label>
              <Form.Select aria-label="Default select example" {...register('network', { required: true })}>
                <option value="devnet" defaultChecked>
                  Devnet
                </option>
                <option value="testnet">Testnet</option>
                <option value="mainnet-beta">Mainnet</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-8 mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="NFT name"
                {...register('name', { required: true, maxLength: 32 })} />
              {errors.name && errors.name.type === 'required' && <p className="text-danger">Required</p>}
              {errors.name && errors.name.type === 'maxLength' && (
                <p className="text-danger">Maximum 32 charcter allowed for name</p>
              )}
            </Form.Group>
            <Form.Group className="col-md-8 mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Symbol</Form.Label>
              <Form.Control
                type="text"
                placeholder="NFT symbol"
                {...register('symbol', { required: true, maxLength: 10 })}
                value={symbol}
                onChange={uppercaseSymbol} />
              {errors.symbol && errors.symbol.type === 'required' && <p className="text-danger">Required</p>}
              {errors.symbol && errors.symbol.type === 'maxLength' && (
                <p className="text-danger">Maximum 10 charcter allowed for name</p>
              )}
            </Form.Group>
            <Form.Group controlId="formFileLg" className="col-md-8 mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                className="col-md-8"
                type="file"
                {...register('file', { required: true })}
                size="lg"
                onChange={(e: any) => {
                  const [fileDisp] = e.target.files;
                  setDispFile(URL.createObjectURL(fileDisp));
                } } />
              {errors.file && errors.file.type === 'required' && <p className="text-danger">Required</p>}
            </Form.Group>
            <Form.Group className="col-md-8 mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" type="text" as="textarea" rows={2} />
            </Form.Group>
            <Form.Group className="col-md-8 mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Max Supply</Form.Label>
              <Form.Control
                type="number"
                min="0"
                placeholder="0"
                {...register('max_supply', { required: true, min: 0 })} />
              {errors.max_supply && errors.max_supply.type === 'required' && <p className="text-danger">Required</p>}
            </Form.Group>

            <Form.Group className="col-md-8 mb-3">
              <label htmlFor="email" className="form-label">
                Attributes*
              </label>

              <div className="row">
                <div className="col-12 col-md-12">
                  {attribs.map((p: any) => {
                    return (
                      <div key={p.id} className="row g-0">
                        <div className="col-12 col-md-6">
                          <Form.Control
                            className="w-100"
                            placeholder="Trait Type"
                            onChange={(e) => {
                              const trait_type = e.target.value;
                              setAttribs((currentps) => currentps.map((x: any) => x.id === p.id
                                ? {
                                  ...x,
                                  trait_type,
                                }
                                : x
                              )
                              );
                            } } />
                        </div>
                        <div className="col-12 col-md-6">
                          <Form.Control
                            className="w-100"
                            placeholder="Value"
                            onChange={(e) => {
                              const value = e.target.value;
                              setAttribs((currentps) => currentps.map((x: any) => x.id === p.id
                                ? {
                                  ...x,
                                  value,
                                }
                                : x
                              )
                              );
                            } } />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="col-12 col-md-4 pt-2">
                  <button
                    className="btn-solid-grad"
                    onClick={(e) => {
                      e.preventDefault();
                      setAttribs((currentAttribs) => [
                        ...currentAttribs,
                        {
                          id: Math.floor(Math.random() * 100 + 1).toString(),
                          trait_type: '',
                          value: '',
                        },
                      ]);
                    } }
                  >
                    Add Item
                  </button>
                  {attribs.length - 1 !== 0 && (
                    <button
                      className=""
                      onClick={(e) => {
                        e.preventDefault();
                        removeField(attribs.length - 1);
                      } }
                    >
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </button>
                  )}
                </div>
              </div>
            </Form.Group>
            <Form.Group className="col-md-8">
              <Form.Label>Royalty</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="number"
                  min={0}
                  placeholder="5"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  {...register('royalty', { required: true, min: 0 })} />
                <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
              </InputGroup>
              {errors.royalty && errors.royalty.type === 'required' && <p className="text-danger">Required</p>}
            </Form.Group>
            <Form.Group className="col-md-8 mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>External Link</Form.Label>
              <Form.Control name="external_link" type="text" placeholder="https://shyft.to" />
            </Form.Group>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Buy some ☕️ to the developers"
              {...register('donate')} />
            <Button variant="warning" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
        <Col>
          <Image className='img-responsive' width={100} height={100} src={dispFile}></Image>
        </Col>
      </Row>
    </Container><LoaderComponent isCompletedTx={isCompletedTx}></LoaderComponent></><ToastContainer /></>
  );
};

class Attribute {
  constructor(trait_type: string, value: string | number) {
    this.trait_type = trait_type;
    this.value = value;
  }

  trait_type: string;
  value: string | number;
}

export default CreateNftComponent;
