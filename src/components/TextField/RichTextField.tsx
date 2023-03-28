import dynamic from "next/dynamic";


const QuillNoSSRWraper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <>Loading...</>
})

const modules = {
    toolbar: [
        [{ header: '1'}, { header: '2' }, {font: []}],
        [{ size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' }
        ],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false
    }
}

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
]

type RichTextFieldProps = {
    handleChange: (event: any) => void
}


export function ControlledRichTextField({
    handleChange
}: RichTextFieldProps){
    return (
        <QuillNoSSRWraper 
        modules={modules} 
        formats={formats} 
        onChange={handleChange}
         />
    )
}