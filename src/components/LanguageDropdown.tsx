export type LanguageDropdownProps = {
    onChange: React.ChangeEventHandler<HTMLSelectElement>
}

export const languageOptions = [
    { value: 'all', name: '— Any language —' },
    { value: 'c', name: 'C' },
    { value: 'c++', name: 'C++' },
    { value: 'csharp', name: 'C#' },
    { value: 'python', name: 'Python' },
    { value: 'javascript', name: 'JavaScript' },
    { value: 'typescript', name: 'TypeScript' },
    { value: 'rust', name: 'Rust' },
] as const

const LanguageDropdown = ({ onChange }: LanguageDropdownProps) =>
    <span>
        <label htmlFor="lang-select">Language filter:</label>
        <select id="lang-select" onChange={onChange}>
            {languageOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.name}</option>
            ))}
        </select>
    </span>

export default LanguageDropdown