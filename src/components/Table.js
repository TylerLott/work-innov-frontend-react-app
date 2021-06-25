import React, { useState, useEffect } from "react"
import "./Table.css"

const Table = () => {
  const [tableData, setTableData] = useState([])
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()

  useEffect(() => {
    if (!image) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  const getData = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setPreview(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function upload_image() {
    if (preview) {
      const formData = new FormData()
      formData.append("file", image)
      fetch("/api/image_upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setTableData(data)
        })
    }
  }

  return (
    <div className="upload-component">
      <div className="info-container">
        <p className="upload-p">
          The 'Upload' button below sends the image your upload below to the
          REST server, which processes the image through it's OCR engine and
          returns the extracted table
        </p>
        <button className="upload-button" onClick={upload_image}>
          Upload
        </button>
        <input id="profilePic" type="file" onChange={getData} />
        <h1>IMAGE STAGED FOR UPLOAD:</h1>
      </div>
      <div className="user-image-container">
        {image && <img className="user-image" src={preview} alt="user_img" />}
      </div>
      <h1>EXTRACTED TABLE:</h1>
      <table className="user-table">
        <tbody className="user-table">
          {tableData.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((data, ind) => {
                  return <td key={ind}>{data}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <p>Contact tyler.lott@ngc.com for questions</p>
    </div>
  )
}

export default Table
