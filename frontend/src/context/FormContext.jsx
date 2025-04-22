import {createContext, useState, useEffect} from "react";
import {useContext} from "react";

const FormContext = createContext({})

export const FormProvider = ({children}) => {

    const [page, setPage] = useState(0)

    return (
        <div>

            {/*    /!* Button *!/*/}
            {/*    <div className="pt-2">*/}
            {/*        <outlet/>*/}
            {/*        <button*/}
            {/*            type="submit"*/}
            {/*            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-4 rounded-md transition-colors"*/}
            {/*        >*/}
            {/*            CONTINUE*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</form>*/}
            {/*<div className="mt-6 flex gap-4">*/}
            {/*    <button*/}
            {/*        onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}*/}
            {/*        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"*/}
            {/*    >*/}
            {/*        Back*/}
            {/*    </button>*/}
            {/*    <button*/}
            {/*        onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 4))}*/}
            {/*        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"*/}
            {/*    >*/}
            {/*        Next*/}
            {/*    </button>*/}
            {/*</div>*/}
        </div>
    );
}

export const useFormContext = () => useContext(FormContext);
